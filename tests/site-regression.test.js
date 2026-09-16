#!/usr/bin/env node
'use strict';

/*
 * Static, dependency-free regression gate for the Ironex redesign.
 *
 * Run from anywhere:
 *   node tests/site-regression.test.js
 *
 * The script intentionally exits non-zero when the checked-out baseline has
 * invariant violations. It does not start a server, use the network, or write
 * to the repository.
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const ORIGIN = 'https://ironex.tech';
// Счётчики Яндекс.Метрики, обязательные на каждой странице сайта.
const METRIKA_COUNTERS = [105009501];
// Счётчики, снесённые как лишние 2026-09-16: их возврат на страницы — регрессия.
const REMOVED_METRIKA_COUNTERS = [105014084, 112539190];
// Число страниц растёт с каждой публикацией, поэтому жёсткой цифры здесь нет:
// гейт держит согласованность (sitemap == индексируемые canonical), а не константу.
const MIN_SITEMAP_URLS = 30;
const CONTENT_INTEGRATIONS = [
  { name: 'analytics-events.js', pathname: '/analytics-events.js' },
  { name: 'email-copy.js', pathname: '/email-copy.js' }
];
const IMAGE_EXTENSIONS = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp']);

const checks = new Map();
const failures = [];

function record(group, ok, message) {
  const current = checks.get(group) || { passed: 0, failed: 0 };
  current[ok ? 'passed' : 'failed'] += 1;
  checks.set(group, current);
  if (!ok) failures.push({ group, message });
}

function expect(group, condition, message) {
  record(group, Boolean(condition), message);
}

function relative(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join('/');
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(filePath));
    else files.push(filePath);
  }
  return files;
}

function decodeHtmlAttribute(value) {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function attributes(tag) {
  const result = Object.create(null);
  const body = tag.replace(/^<\/?[a-z0-9:-]+/i, '').replace(/\/?>\s*$/, '');
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;
  while ((match = pattern.exec(body))) {
    result[match[1].toLowerCase()] = decodeHtmlAttribute(match[2] ?? match[3] ?? match[4] ?? '');
  }
  return result;
}

function tags(html, tagName) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) || [];
}

function htmlForSiteUrl(siteUrl) {
  const url = new URL(siteUrl);
  if (url.origin !== ORIGIN) return null;
  const decodedPath = decodeURIComponent(url.pathname);
  const relativePath = decodedPath === '/'
    ? 'index.html'
    : decodedPath.replace(/^\/+/, '').replace(/\/$/, '/index.html');
  const target = path.resolve(ROOT, relativePath);
  if (target !== ROOT && !target.startsWith(`${ROOT}${path.sep}`)) return null;
  return target;
}

function pageUrl(filePath) {
  const rel = relative(filePath);
  return rel === 'index.html' ? `${ORIGIN}/` : `${ORIGIN}/${rel}`;
}

function canonicalUrls(html) {
  return tags(html, 'link')
    .map(attributes)
    .filter(attrs => (attrs.rel || '').toLowerCase().split(/\s+/).includes('canonical'))
    .map(attrs => attrs.href)
    .filter(Boolean);
}

function isNoindex(html) {
  return tags(html, 'meta').map(attributes).some(attrs =>
    (attrs.name || '').toLowerCase() === 'robots' &&
    (attrs.content || '').toLowerCase().split(/[\s,]+/).includes('noindex')
  );
}

function scripts(html) {
  const result = [];
  const pattern = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    result.push({ attrs: attributes(`<script${match[1]}>`), body: match[2] });
  }
  return result;
}

function localTarget(rawValue, sourceFile) {
  const value = rawValue.trim();
  if (!value || /^(?:data|javascript|mailto|tel):/i.test(value)) return null;
  const base = pageUrl(sourceFile);
  let url;
  try {
    url = new URL(value, base);
  } catch {
    return { invalid: true, rawValue: value };
  }
  if (url.origin !== ORIGIN) return null;
  return { url, filePath: htmlForSiteUrl(url.href) };
}

function idsIn(html) {
  const ids = new Set();
  for (const tag of html.match(/<[a-z][^>]*>/gi) || []) {
    const attrs = attributes(tag);
    if (attrs.id) ids.add(attrs.id);
    if (/^<a\b/i.test(tag) && attrs.name) ids.add(attrs.name);
  }
  return ids;
}

function referenceAttributes(html) {
  const result = [];
  for (const tag of html.match(/<[a-z][^>]*>/gi) || []) {
    const attrs = attributes(tag);
    if (attrs.href) result.push({ kind: 'href', value: attrs.href });
    if (attrs.src) result.push({ kind: 'src', value: attrs.src });
    if (attrs.srcset) {
      for (const candidate of attrs.srcset.split(',')) {
        const value = candidate.trim().split(/\s+/)[0];
        if (value) result.push({ kind: 'srcset', value });
      }
    }
  }
  return result;
}

function imageKind(buffer) {
  const head = buffer.subarray(0, 64);
  const ascii = head.toString('ascii');
  const utf8 = buffer.subarray(0, 512).toString('utf8').trimStart().toLowerCase();
  if (utf8.startsWith('<!doctype html') || utf8.startsWith('<html')) return 'html';
  if (head.length >= 12 && ascii.startsWith('RIFF') && ascii.slice(8, 12) === 'WEBP') return 'webp';
  if (head.length >= 12 && ascii.slice(4, 8) === 'ftyp' && /avif|avis/.test(ascii.slice(8))) return 'avif';
  if (head.length >= 8 && head.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (head.length >= 3 && head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return 'jpeg';
  if (ascii.startsWith('GIF87a') || ascii.startsWith('GIF89a')) return 'gif';
  if (/^(?:<\?xml[^>]*>\s*)?<svg\b/i.test(utf8)) return 'svg';
  return 'unknown';
}

function expectedKind(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === '.jpg' || extension === '.jpeg') return 'jpeg';
  return extension.slice(1);
}

function countPattern(html, pattern) {
  return (html.match(pattern) || []).length;
}

const allFiles = walk(ROOT);
const allHtmlFiles = allFiles.filter(filePath => filePath.endsWith('.html'));
const allImageFiles = allFiles.filter(filePath => IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase()));

const sitemapPath = path.join(ROOT, 'sitemap.xml');
expect('sitemap/canonical', fs.existsSync(sitemapPath), 'sitemap.xml is missing');
const sitemapXml = fs.existsSync(sitemapPath) ? readText(sitemapPath) : '';
const sitemapUrls = [...sitemapXml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
  .map(match => decodeHtmlAttribute(match[1].trim()));
const uniqueSitemapUrls = new Set(sitemapUrls);

expect(
  'sitemap/canonical',
  sitemapUrls.length >= MIN_SITEMAP_URLS,
  `sitemap.xml must contain at least ${MIN_SITEMAP_URLS} URLs, found ${sitemapUrls.length}`
);
expect(
  'sitemap/canonical',
  uniqueSitemapUrls.size === sitemapUrls.length,
  `sitemap.xml contains ${sitemapUrls.length - uniqueSitemapUrls.size} duplicate URL(s)`
);

const canonicalRecords = [];
for (const filePath of allHtmlFiles) {
  const html = readText(filePath);
  const canonicals = canonicalUrls(html);
  if (canonicals.length === 1) {
    canonicalRecords.push({ canonical: canonicals[0], filePath, noindex: isNoindex(html) });
  }
  else if (canonicals.length > 1) {
    expect('sitemap/canonical', false, `${relative(filePath)} has ${canonicals.length} canonical links`);
  }
}

const canonicalToFiles = new Map();
for (const record of canonicalRecords) {
  const files = canonicalToFiles.get(record.canonical) || [];
  files.push(record.filePath);
  canonicalToFiles.set(record.canonical, files);
}
for (const [canonical, files] of canonicalToFiles) {
  expect(
    'sitemap/canonical',
    files.length === 1,
    `canonical ${canonical} is shared by: ${files.map(relative).join(', ')}`
  );
}

const indexableCanonicalRecords = canonicalRecords.filter(record => !record.noindex);

expect(
  'sitemap/canonical',
  indexableCanonicalRecords.length === sitemapUrls.length,
  `sitemap.xml has ${sitemapUrls.length} URLs, but repository has ${indexableCanonicalRecords.length} indexable pages with one canonical`
);

const sitemapPages = [];
for (const siteUrl of sitemapUrls) {
  let parsed;
  try {
    parsed = new URL(siteUrl);
  } catch {
    expect('sitemap/canonical', false, `invalid sitemap URL: ${siteUrl}`);
    continue;
  }
  expect('sitemap/canonical', parsed.origin === ORIGIN, `sitemap URL is outside ${ORIGIN}: ${siteUrl}`);
  const filePath = htmlForSiteUrl(siteUrl);
  expect('sitemap/canonical', Boolean(filePath && fs.existsSync(filePath)), `sitemap URL has no local file: ${siteUrl}`);
  if (!filePath || !fs.existsSync(filePath)) continue;
  const html = readText(filePath);
  const canonicals = canonicalUrls(html);
  expect('sitemap/canonical', canonicals.length === 1, `${relative(filePath)} must have exactly one canonical, found ${canonicals.length}`);
  expect('sitemap/canonical', canonicals[0] === siteUrl, `${relative(filePath)} canonical ${canonicals[0] || '(missing)'} does not match ${siteUrl}`);
  sitemapPages.push({ siteUrl, filePath, html });
}

for (const { canonical, filePath, noindex } of canonicalRecords) {
  if (!noindex) {
    expect('sitemap/canonical', uniqueSitemapUrls.has(canonical), `${relative(filePath)} canonical is absent from sitemap: ${canonical}`);
  }
  expect('sitemap/canonical', pageUrl(filePath) === canonical, `${relative(filePath)} canonical is not self-referential: ${canonical}`);
}

for (const { filePath, html } of sitemapPages) {
  const file = relative(filePath);
  expect('semantics', countPattern(html, /<h1\b/gi) === 1, `${file} must contain exactly one H1`);
  expect('semantics', countPattern(html, /<main\b/gi) === 1, `${file} must contain exactly one main landmark`);

  const jsonLd = scripts(html).filter(script => (script.attrs.type || '').toLowerCase() === 'application/ld+json');
  expect('json-ld', jsonLd.length > 0, `${file} has no application/ld+json block`);
  jsonLd.forEach((script, index) => {
    try {
      JSON.parse(script.body.trim());
      record('json-ld', true, '');
    } catch (error) {
      expect('json-ld', false, `${file} JSON-LD block ${index + 1} is invalid: ${error.message}`);
    }
  });
}

const checkedReferences = new Set();
const contentFiles = allHtmlFiles.filter(filePath => {
  const file = relative(filePath);
  return file === '404.html' || canonicalUrls(readText(filePath)).length > 0;
});

for (const sourceFile of contentFiles) {
  const html = readText(sourceFile);
  for (const reference of referenceAttributes(html)) {
    const target = localTarget(reference.value, sourceFile);
    if (!target) continue;
    if (target.invalid) {
      expect('local references', false, `${relative(sourceFile)} has invalid ${reference.kind}: ${reference.value}`);
      continue;
    }
    const key = `${relative(sourceFile)}\0${reference.kind}\0${target.url.href}`;
    if (checkedReferences.has(key)) continue;
    checkedReferences.add(key);
    expect(
      'local references',
      Boolean(target.filePath && fs.existsSync(target.filePath)),
      `${relative(sourceFile)} has broken ${reference.kind}: ${reference.value}`
    );
    if (!target.filePath || !fs.existsSync(target.filePath) || !target.url.hash || !target.filePath.endsWith('.html')) continue;
    let fragment;
    try {
      fragment = decodeURIComponent(target.url.hash.slice(1));
    } catch {
      expect('local references', false, `${relative(sourceFile)} has malformed fragment: ${reference.value}`);
      continue;
    }
    const targetIds = idsIn(readText(target.filePath));
    expect(
      'local references',
      targetIds.has(fragment),
      `${relative(sourceFile)} links to missing fragment #${fragment} in ${relative(target.filePath)}`
    );
  }
}

for (const { filePath, html } of sitemapPages) {
  const file = relative(filePath);
  const pageScripts = scripts(html);
  const scriptSources = pageScripts.map(script => script.attrs.src).filter(Boolean);
  const callibriSources = scriptSources.filter(src => /(?:^|\/)cdn\.callibri\.ru\/callibri\.js(?:[?#]|$)/i.test(src));
  expect('integrations', callibriSources.length === 1, `${file} must load Callibri exactly once, found ${callibriSources.length}`);
  for (const counter of METRIKA_COUNTERS) {
    expect(
      'integrations',
      countPattern(html, new RegExp(`\\bym\\s*\\(\\s*${counter}\\s*,\\s*["']init["']`, 'g')) === 1,
      `${file} must initialize Metrika ${counter} exactly once`
    );
    expect(
      'integrations',
      new RegExp(`https://mc\\.yandex\\.ru/watch/${counter}`, 'i').test(html),
      `${file} is missing the Metrika ${counter} noscript pixel`
    );
  }
  // Снятые счётчики (2026-09-16) не должны вернуться ни инициализацией, ни пикселем.
  for (const counter of REMOVED_METRIKA_COUNTERS) {
    expect(
      'integrations',
      !new RegExp(`\\b${counter}\\b`).test(html),
      `${file} must not reference the removed Metrika counter ${counter}`
    );
  }

  for (const integration of CONTENT_INTEGRATIONS) {
    const references = referenceAttributes(html).filter(reference => {
      const target = localTarget(reference.value, filePath);
      return target && !target.invalid && target.url.pathname === integration.pathname;
    });
    expect(
      'integrations',
      references.length === 1,
      `${file} must reference ${integration.name} exactly once, found ${references.length}`
    );
  }

  expect('integrations', /href=["']tel:\+79934904024["']/i.test(html), `${file} lost the Callibri source telephone`);
  expect('integrations', /href=["']mailto:info@ironex\.tech["']/i.test(html), `${file} lost the Callibri source email`);
}

const blogIndexPath = path.join(ROOT, 'blog.html');
const blogIndexHtml = readText(blogIndexPath);
const articleFiles = allHtmlFiles.filter(filePath => relative(filePath).startsWith('blog/'));
const catalogSlugs = [...blogIndexHtml.matchAll(/data-seo-slug="([^"]+)"/g)].map(match => match[1]);
const uniqueCatalogSlugs = new Set(catalogSlugs);
expect('blog contract', catalogSlugs.length === articleFiles.length, `blog catalog has ${catalogSlugs.length} cards for ${articleFiles.length} articles`);
expect('blog contract', uniqueCatalogSlugs.size === catalogSlugs.length, 'blog catalog contains duplicate article cards');
for (const filePath of articleFiles) {
  const slug = path.basename(filePath, '.html');
  expect('blog contract', uniqueCatalogSlugs.has(slug), `blog catalog is missing ${slug}`);
}

const filterLinks = tags(blogIndexHtml, 'a').map(tag => ({ tag, attrs: attributes(tag) }))
  .filter(link => Object.hasOwn(link.attrs, 'data-blog-filter'));
expect('blog contract', filterLinks.length === 7, `blog needs 7 link filters, found ${filterLinks.length}`);
for (const link of filterLinks) {
  expect('blog contract', Boolean(link.attrs.href), `blog filter ${link.attrs['data-blog-filter']} has no href fallback`);
}
expect('blog contract', /id="materials"/.test(blogIndexHtml), 'blog archive needs the #materials navigation target');

// Карточка витрины — любой элемент с data-seo-slug: класс может смениться
// вместе с оформлением, а признак «это карточка статьи» остаётся.
const catalogCardPattern = /<(a|article)\s+class="[^"]*"\s+data-seo-slug="[\s\S]*?<\/\1>/g;
for (const card of blogIndexHtml.match(catalogCardPattern) || []) {
  expect('blog contract', /<time\b[^>]*datetime="\d{4}-\d{2}-\d{2}"/.test(card), 'every blog card needs a visible machine-readable date');
}

const blogSchema = scripts(blogIndexHtml)
  .filter(script => (script.attrs.type || '').toLowerCase() === 'application/ld+json')
  .map(script => JSON.parse(script.body.trim()))[0];
const blogItemList = blogSchema['@graph'].find(node => node['@type'] === 'ItemList');
expect('blog contract', blogItemList.itemListElement.length === catalogSlugs.length, 'ItemList and visible catalog must have equal length');

for (const filePath of articleFiles) {
  const html = readText(filePath);
  const file = relative(filePath);
  expect('blog contract', /<div class="byline">[\s\S]*?<time\b[^>]*datetime="\d{4}-\d{2}-\d{2}"/.test(html), `${file} needs a machine-readable visible date in the byline`);
  expect('blog contract', /Опубликовано/.test(html), `${file} must label the publication date, not only "Обновлено"`);
  expect('blog contract', countPattern(html, /class="card mat-card"/g) === 3, `${file} needs exactly 3 real related materials`);
  expect('blog contract', countPattern(html, /class="statement statement--grid section"/g) === 1, `${file} needs one closing statement block`);
  expect('blog contract', countPattern(html, /<details\b/g) >= 1, `${file} must render its FAQ as an accordion`);
  // Дизайн-система: страницы не заводят своих стилей, всё приходит из /ironex.css
  expect('blog contract', countPattern(html, /<style[\s>]/g) === 0, `${file} must not carry its own <style> block`);
  expect('blog contract', /<link rel="stylesheet" href="\/ironex\.css"/.test(html), `${file} must load /ironex.css`);
}

const redesignSource = readText(path.join(ROOT, 'redesign.js'));
expect('blog contract', /createElement\("a"\)/.test(redesignSource), 'enhanced pagination must create ordinary links');
expect('blog contract', !/createElement\("button"\)/.test(redesignSource), 'blog pagination must not be button-only');

const analyticsSource = readText(path.join(ROOT, 'analytics-events.js'));
for (const token of [...METRIKA_COUNTERS.map(String), 'contact_any', 'contact_phone', 'contact_email', 'contact_whatsapp', 'contact_telegram']) {
  expect('integration scripts', analyticsSource.includes(token), `analytics-events.js is missing ${token}`);
}
for (const token of ["[data-email-value]", "[data-copy-email]", "[data-email-copy]", 'textContent']) {
  expect('integration scripts', readText(path.join(ROOT, 'email-copy.js')).includes(token), `email-copy.js is missing DOM-safe token ${token}`);
}

for (const { filePath, html } of sitemapPages) {
  const file = relative(filePath);
  const pageImages = tags(html, 'img').map(tag => ({ tag, attrs: attributes(tag) }));
  const contentImages = pageImages.filter(image => !/^https:\/\/mc\.yandex\.ru\/watch\//i.test(image.attrs.src || ''));
  let nonLazyContentImages = 0;

  for (const image of pageImages) {
    const label = image.attrs.src || '(missing src)';
    const width = Number(image.attrs.width);
    const height = Number(image.attrs.height);
    expect('image markup', Number.isInteger(width) && width > 0, `${file} image ${label} needs a positive integer width`);
    expect('image markup', Number.isInteger(height) && height > 0, `${file} image ${label} needs a positive integer height`);
    if (image.attrs.loading) {
      expect('image markup', /^(?:eager|lazy)$/i.test(image.attrs.loading), `${file} image ${label} has invalid loading=${image.attrs.loading}`);
    }
    if ((image.attrs.fetchpriority || '').toLowerCase() === 'high') {
      expect('image markup', (image.attrs.loading || '').toLowerCase() !== 'lazy', `${file} LCP image ${label} cannot be loading=lazy`);
    }
  }

  for (const image of contentImages) {
    if ((image.attrs.loading || '').toLowerCase() !== 'lazy') nonLazyContentImages += 1;
  }
  expect(
    'image loading',
    nonLazyContentImages <= 1,
    `${file} has ${nonLazyContentImages} non-lazy content images; allow at most one LCP candidate`
  );
}

for (const filePath of allImageFiles) {
  const buffer = fs.readFileSync(filePath);
  const actual = imageKind(buffer);
  const expected = expectedKind(filePath);
  expect(
    'image files',
    actual === expected,
    `${relative(filePath)} has .${expected} extension but contains ${actual === 'html' ? 'HTML' : actual}`
  );
}

// ── Шрифты: только свои, Google Fonts не возвращаются ────────────────────────
// Добавлено 2026-09-16. Google Fonts отдавали render-blocking CSS по 1,0–1,4 с
// с домашних линий РФ — страница стояла белой. Шрифт самохостится в /fonts/.
const FONT_FILES = [
  'fonts/manrope-cyrillic.woff2',
  'fonts/manrope-latin.woff2',
  'fonts/manrope-latin-ext.woff2',
  'fonts/manrope-currency.woff2'
];
const PRELOADED_FONTS = ['/fonts/manrope-cyrillic.woff2', '/fonts/manrope-latin.woff2'];

for (const fontFile of FONT_FILES) {
  expect('fonts', fs.existsSync(path.join(ROOT, fontFile)), `${fontFile} is missing from the repository`);
}
expect('fonts', fs.existsSync(path.join(ROOT, 'fonts/OFL.txt')), 'fonts/OFL.txt (SIL Open Font License) is missing');

for (const filePath of allHtmlFiles) {
  const file = relative(filePath);
  const html = readText(filePath);
  expect(
    'fonts',
    !/fonts\.(?:googleapis|gstatic)\.com/i.test(html),
    `${file} loads Google Fonts again; the font is self-hosted in /fonts/`
  );
  // Верификационные заглушки Яндекса не подключают стилей и шрифтов не ждут —
  // preload спрашиваем только со страниц сайта, то есть с потребителей ironex.css.
  if (!/href=["']\/ironex\.css["']/i.test(html)) continue;
  for (const font of PRELOADED_FONTS) {
    expect(
      'fonts',
      new RegExp(`rel=["']preload["'][^>]*href=["']${font.replace(/[/.]/g, '\\$&')}["']`, 'i').test(html),
      `${file} lost the preload for ${font}`
    );
  }
}

// Порядок @font-face в ironex.css несёт смысл: ₽ (U+20BD) входит и в latin-ext,
// и в currency. При пересечении диапазонов CSS берёт объявленное ПОЗЖЕ, поэтому
// currency обязан идти последним — иначе ради одного знака рубля снова поедет
// полный latin-ext на 15 КБ.
const mainCss = readText(path.join(ROOT, 'ironex.css'));
const latinExtAt = mainCss.indexOf('/fonts/manrope-latin-ext.woff2');
const currencyAt = mainCss.indexOf('/fonts/manrope-currency.woff2');
expect('fonts', latinExtAt !== -1 && currencyAt !== -1, 'ironex.css must declare both latin-ext and currency @font-face');
expect(
  'fonts',
  latinExtAt !== -1 && currencyAt !== -1 && currencyAt > latinExtAt,
  'ironex.css: the currency @font-face must be declared AFTER latin-ext, otherwise ₽ pulls the full latin-ext file'
);

// В диапазоне currency обязан быть пропуск под € (U+20AC): евро лежит в latin,
// в currency-файле его нет, и сплошной диапазон дал бы пустой квадрат.
const currencyRule = mainCss.slice(currencyAt === -1 ? 0 : currencyAt);
const currencyRange = (currencyRule.match(/unicode-range:\s*([^;]+);/) || [])[1] || '';
expect(
  'fonts',
  /U\+20A0-20AB/i.test(currencyRange) && /U\+20AD-20C0/i.test(currencyRange) && !/U\+20A0-20C0/i.test(currencyRange),
  'ironex.css: currency unicode-range must skip U+20AC (€ lives in the latin subset)'
);

console.log(`Ironex static regression gate: ${relative(ROOT) || ROOT}`);
for (const [group, result] of checks) {
  const status = result.failed === 0 ? 'PASS' : 'FAIL';
  console.log(`${status.padEnd(4)}  ${group}: ${result.passed} passed, ${result.failed} failed`);
}

if (failures.length) {
  console.log(`\n${failures.length} violation(s):`);
  failures.forEach((failure, index) => console.log(`${index + 1}. [${failure.group}] ${failure.message}`));
  process.exitCode = 1;
} else {
  console.log('\nAll redesign invariants passed.');
}
