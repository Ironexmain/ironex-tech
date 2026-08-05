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
