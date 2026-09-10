(function () {
  // Мобильное меню собирается из уже существующего списка навигации: отдельной
  // разметки выпадашки нет намеренно. Дублирующий блок ссылок в каждой странице
  // рано или поздно разъезжается с основным меню, и на телефоне человек видит
  // не то, что на десктопе.
  var header = document.querySelector('.site-header');
  var burger = document.querySelector('.burger, .hamburger');
  if (!header || !burger) return;

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
