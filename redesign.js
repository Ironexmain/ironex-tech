(function () {
  "use strict";

  var button = document.querySelector(".hamburger[aria-controls]");
  if (!button) return;

  var menu = document.getElementById(button.getAttribute("aria-controls"));
  if (!menu) return;

  function setMenu(open) {
    menu.classList.toggle("open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  }

  button.addEventListener("click", function () {
    setMenu(button.getAttribute("aria-expanded") !== "true");
  });

  menu.addEventListener("click", function (event) {
    if (event.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      button.focus();
    }
  });

  setMenu(false);
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
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = String(page);
      button.setAttribute("aria-label", "Страница " + page);
      if (page === activePage) {
        button.className = "is-active";
        button.setAttribute("aria-current", "page");
      }
      button.addEventListener("click", (function (nextPage) {
        return function () {
          activePage = nextPage;
          render();
          grid.scrollIntoView({ behavior: "smooth", block: "start" });
        };
      })(page));
      pagination.appendChild(button);
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
    renderPagination(visible.length ? pageCount : 0);
  }

  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.getAttribute("data-blog-filter") || "all";
      activePage = 1;
      filters.forEach(function (item) {
        var current = item === button;
        item.classList.toggle("is-active", current);
        item.setAttribute("aria-pressed", String(current));
      });
      render();
    });
  });

  render();
})();
