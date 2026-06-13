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

  /* --- 4. Contact form → compose a pre-filled email --------------------
     The site is static, so there is no server. On submit we build a
     mailto: link with the structured fields and open the visitor's own
     email client. Nothing is stored. */
  var sendBtn = document.getElementById("cf-send");
  if (sendBtn) {
    sendBtn.addEventListener("click", function () {
      var val = function (id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : "";
      };
      var first = val("cf-first"), last = val("cf-last"), email = val("cf-email"),
          phone = val("cf-phone"), type = val("cf-type"), msg = val("cf-msg");
      var note = document.getElementById("cf-note");

      if (!first || !last || !email || !msg) {
        if (note) note.textContent = "Please add your name, email, and message.";
        return;
      }
      if (note) note.textContent = "";

      var subject = "Inquiry from " + first + " " + last + (type ? " — " + type : "");
      var body =
        "Name: " + first + " " + last + "\n" +
        "Email: " + email + "\n" +
        (phone ? "Phone: " + phone + "\n" : "") +
        (type ? "Project type: " + type + "\n" : "") +
        "\n" + msg + "\n";

      window.location.href =
        "mailto:office@elephanthawk.com?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  }
})();
