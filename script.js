/* =====================================================================
   Elephant Hawk — site script
   Tiny and dependency-free. Two jobs:
     1. Toggle the mobile navigation menu open/closed.
     2. Stamp the current year into the footer automatically.
   ===================================================================== */

(function () {
  "use strict";

  /* --- 1. Mobile nav toggle ------------------------------------------ */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      // The menu's open/closed state is tracked by the `hidden` attribute,
      // which CSS reads (.nav-links[hidden]) and screen readers respect.
      var isOpen = !links.hasAttribute("hidden");
      if (isOpen) {
        links.setAttribute("hidden", "");
      } else {
        links.removeAttribute("hidden");
      }
      // Tell assistive tech whether the menu is expanded.
      toggle.setAttribute("aria-expanded", String(!isOpen));
    });
  }

  /* --- 2. Auto-update the copyright year ----------------------------- */
  // Any element with id="year" gets the current year dropped in, so we
  // never have to hand-edit the footer each January.
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
