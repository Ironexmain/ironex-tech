const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(new URL('../analytics-events.js', `file://${__filename}`), 'utf8');

function element({ href = '', copy = false, zone = 'content' }) {
  return {
    getAttribute(name) {
      return name === 'href' ? href : null;
    },
    closest(selector) {
      if (selector === '[data-copy-email]') return copy ? this : null;
      if (selector === 'a[href]') return href ? this : null;
      if (selector.includes('nav')) return zone === 'navigation' ? this : null;
      if (selector === 'footer') return zone === 'footer' ? this : null;
      if (selector.includes('.cta')) return zone === 'cta' ? this : null;
      return null;
    }
  };
}

function load(pathname, withMetrika = true) {
  let clickHandler;
  const calls = [];
  const context = {
    document: {
      addEventListener(type, handler) {
        if (type === 'click') clickHandler = handler;
      }
    },
    window: { location: { pathname } }
  };
  if (withMetrika) context.window.ym = (...args) => calls.push(args);
  vm.runInNewContext(source, context);
  return { calls, click: target => clickHandler({ target }) };
}

const test = load('/blog/example.html');
test.click(element({ href: 'tel:+70000000000', zone: 'navigation' }));
test.click(element({ href: 'mailto:dynamic@example.test', zone: 'cta' }));
test.click(element({ href: 'https://wa.me/70000000000', zone: 'footer' }));
test.click(element({ href: 'https://t.me/example' }));
test.click(element({ copy: true, zone: 'cta' }));

// Каждая цель уходит во все счётчики Метрики, поэтому вызовы идут группами.
const COUNTERS = [105009501, 105014084, 112539190];
const goals = [];
for (let i = 0; i < test.calls.length; i += COUNTERS.length) {
  const group = test.calls.slice(i, i + COUNTERS.length);
  assert.deepEqual(group.map(call => call[0]), COUNTERS);
  assert.deepEqual(group.map(call => call[2]), group.map(() => group[0][2]));
  goals.push(group[0][2]);
}

assert.deepEqual(goals, [
  'contact_phone', 'contact_any',
  'contact_email', 'contact_any',
  'contact_whatsapp', 'contact_any',
  'contact_telegram', 'contact_any',
  'contact_email', 'contact_any'
]);
assert.equal(test.calls[0][1], 'reachGoal');
assert.equal(test.calls[0][3].page.type, 'article');
assert.equal(test.calls[0][3].contact.placement, 'navigation');
assert.equal(test.calls[8 * COUNTERS.length][3].contact.method, 'copy');
assert.doesNotMatch(JSON.stringify(test.calls), /dynamic@example|70000000000/);

const noMetrika = load('/kontakty.html', false);
assert.doesNotThrow(() => noMetrika.click(element({ href: 'tel:+70000000000' })));

console.log('analytics-events: проверки пройдены (' + COUNTERS.length + ' счётчика)');
