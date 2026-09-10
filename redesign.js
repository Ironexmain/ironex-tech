(function () {
  // Мобильное меню собирается из уже существующего списка навигации: отдельной
  // разметки выпадашки нет намеренно. Дублирующий блок ссылок в каждой странице
  // рано или поздно разъезжается с основным меню, и на телефоне человек видит
  // не то, что на десктопе.
  var header = document.querySelector('.site-header');
  var burger = document.querySelector('.burger, .hamburger');
  if (!burger) return;

  // Старые страницы сайта живут на прежней разметке: там нет .site-header,
  // а меню — отдельный блок, который открывается классом .open. Пока обе
  // версии стоят рядом на одном домене, один скрипт обслуживает обе.
  if (!header) {
    var legacy = burger.getAttribute('aria-controls');
    var menu = legacy && document.getElementById(legacy);
    if (!menu) return;
    var setLegacy = function (open) {
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    };
    burger.addEventListener('click', function () {
      setLegacy(burger.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setLegacy(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setLegacy(false);
        burger.focus();
      }
    });
    setLegacy(false);
    return;
  }

  function setOpen(open) {
    header.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }

  burger.addEventListener('click', function () {
    setOpen(!header.classList.contains('is-open'));
  });

  header.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      setOpen(false);
      burger.focus();
    }
  });

  // Ушли с узкого экрана — состояние сбрасываем, иначе меню залипает открытым
  var wide = window.matchMedia('(min-width: 861px)');
  (wide.addEventListener ? wide.addEventListener.bind(wide, 'change') : wide.addListener.bind(wide))(function () {
    if (wide.matches) setOpen(false);
  });
})();

(function () {
  "use strict";

  var progress = document.querySelector(".reading-progress span");
  var backToTop = document.querySelector(".back-to-top");

  function updateReadingTools() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    if (progress) progress.style.transform = "scaleX(" + ratio + ")";
    if (backToTop) backToTop.classList.toggle("is-visible", window.scrollY > 640);
  }

  if (progress || backToTop) {
    window.addEventListener("scroll", updateReadingTools, { passive: true });
    updateReadingTools();
  }

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();

(function () {
  "use strict";

  var grid = document.querySelector("[data-blog-grid]");
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-seo-slug]"));
  var filters = Array.prototype.slice.call(document.querySelectorAll("[data-blog-filter]"));
  var empty = document.querySelector("[data-blog-empty]");
  var pagination = document.querySelector("[data-blog-pagination]");
  var pageSize = Number(grid.getAttribute("data-page-size")) || 6;
  var activeFilter = "all";
  var activePage = 1;

  function validFilter(value) {
    return filters.some(function (filter) {
      return filter.getAttribute("data-blog-filter") === value;
    }) ? value : "all";
  }

  function readLocation() {
    var params = new URLSearchParams(window.location.search);
    activeFilter = validFilter(params.get("category") || "all");
    activePage = Math.max(1, Number(params.get("page")) || 1);
  }

  function stateHref(filter, page) {
    var params = new URLSearchParams();
    if (filter !== "all") params.set("category", filter);
    if (page > 1) params.set("page", String(page));
    var query = params.toString();
    return "blog.html" + (query ? "?" + query : "") + "#materials";
  }

  function setLocation(push) {
    if (!window.history || !window.history.pushState) return;
    window.history[push ? "pushState" : "replaceState"](
      { category: activeFilter, page: activePage },
      "",
      stateHref(activeFilter, activePage)
    );
  }

  function filteredCards() {
    return cards.filter(function (card) {
      return activeFilter === "all" || card.getAttribute("data-category") === activeFilter;
    });
  }

  function renderPagination(pageCount) {
    if (!pagination) return;
    pagination.innerHTML = "";
    pagination.hidden = pageCount <= 1;
    for (var page = 1; page <= pageCount; page += 1) {
      var link = document.createElement("a");
      link.href = stateHref(activeFilter, page);
      link.textContent = String(page);
      link.setAttribute("aria-label", "Страница " + page);
      if (page === activePage) {
        link.className = "is-active";
        link.setAttribute("aria-current", "page");
      }
      link.addEventListener("click", (function (nextPage) {
        return function (event) {
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          activePage = nextPage;
          render();
          setLocation(true);
          grid.scrollIntoView({ behavior: "smooth", block: "start" });
        };
      })(page));
      pagination.appendChild(link);
    }
  }

  function render() {
    var visible = filteredCards();
    var pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
    if (activePage > pageCount) activePage = pageCount;
    cards.forEach(function (card) { card.hidden = true; });
    visible.slice((activePage - 1) * pageSize, activePage * pageSize).forEach(function (card) {
      card.hidden = false;
    });
    if (empty) empty.hidden = visible.length !== 0;
    filters.forEach(function (item) {
      var current = item.getAttribute("data-blog-filter") === activeFilter;
      item.classList.toggle("is-active", current);
      if (current) item.setAttribute("aria-current", "true");
      else item.removeAttribute("aria-current");
    });
    renderPagination(visible.length ? pageCount : 0);
  }

  filters.forEach(function (filter) {
    filter.addEventListener("click", function (event) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      activeFilter = filter.getAttribute("data-blog-filter") || "all";
      activePage = 1;
      render();
      setLocation(true);
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  window.addEventListener("popstate", function () {
    readLocation();
    render();
  });

  readLocation();
  render();
})();

/* ── Живая строка в шапке ───────────────────────────────────────────────────
   Показывает московское время и работает ли сейчас приёмка чертежей.
   Приёмка: Пн–Пт 09:00–19:00 МСК. Письмо можно прислать всегда — строка
   говорит только о том, ответят сегодня или следующим рабочим утром. */
(function () {
  var bar = document.querySelector('[data-clockbar]');
  if (!bar) return;
  var elTime = bar.querySelector('[data-clock-time]');
  var elState = bar.querySelector('[data-clock-state]');
  var fmt = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit', hour12: false
  });
  var parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Moscow', weekday: 'short', hour: 'numeric', hour12: false
  });

  function tick() {
    var now = new Date();
    elTime.textContent = 'Москва ' + fmt.format(now);
    var p = parts.formatToParts(now).reduce(function (a, x) { a[x.type] = x.value; return a; }, {});
    var weekend = p.weekday === 'Sat' || p.weekday === 'Sun';
    var h = parseInt(p.hour, 10);
    var open = !weekend && h >= 9 && h < 19;
    elState.textContent = open ? 'приёмка чертежей открыта' : 'ответим утром в рабочий день';
    elState.className = open ? 'is-open' : 'is-closed';
  }
  tick();
  setInterval(tick, 30000);
})();

/* ── Видео первого экрана ───────────────────────────────────────────────────
   preload="none" в разметке: пока не решено, что видео вообще нужно, качается
   только постер. Здесь решаем — и не качаем полтора мегабайта тем, кто просил
   убрать анимацию, и тем, у кого экономия трафика. */
(function () {
  var v = document.querySelector('[data-hero-video]');
  if (!v) return;
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saver = navigator.connection && (navigator.connection.saveData ||
              /2g/.test(navigator.connection.effectiveType || ''));
  if (calm || saver) { v.removeAttribute('autoplay'); v.remove(); return; }
  v.preload = 'auto';
  v.load();
  var play = v.play();
  if (play && play.catch) play.catch(function () { /* автоплей запрещён — остаётся постер */ });
})();

/* ── Появление секций при прокрутке ─────────────────────────────────────── */
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    for (var i = 0; i < items.length; i++) items[i].classList.add('is-in');
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  items.forEach(function (el) { io.observe(el); });
})();
