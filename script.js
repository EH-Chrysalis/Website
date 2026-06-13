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

  /* --- 3. Scroll reveal -----------------------------------------------
     Fade each section's content up as it scrolls into view. We add the
     `.reveal` class from JS so that if JS never runs (or is stripped),
     the content simply shows — no blank page. Respects reduced-motion. */
  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReduced && "IntersectionObserver" in window) {
    // Every section's inner container, except the hero (it's the first paint).
    var blocks = document.querySelectorAll("main section:not(.hero) .container");
    blocks.forEach(function (el) { el.classList.add("reveal"); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    blocks.forEach(function (el) { io.observe(el); });
  }
})();
