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

  /* --- 4. Contact form → POST to Formspree via fetch (stays on page) ---
     Native required-field validation runs first (the form has no
     `novalidate`), so this handler only fires when the form is valid. On
     success the form is swapped for an inline confirmation. With JS off, the
     form still POSTs normally to Formspree (graceful fallback). */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = document.getElementById("cf-note");
      var success = document.getElementById("cf-success");
      var btn = document.getElementById("cf-send");
      if (note) note.textContent = "Sending…";
      if (btn) btn.disabled = true;
      fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { "Accept": "application/json" }
      }).then(function (res) {
        if (res.ok) {
          if (note) note.textContent = "";
          if (success) {
            contactForm.setAttribute("hidden", "");
            success.removeAttribute("hidden");
            success.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else {
          if (btn) btn.disabled = false;
          if (note) note.textContent = "Something went wrong — please email office@elephanthawk.com.";
        }
      }).catch(function () {
        if (btn) btn.disabled = false;
        if (note) note.textContent = "Network error — please email office@elephanthawk.com.";
      });
    });
  }

  /* --- 5. Count-up stats ----------------------------------------------
     When the proof strip scrolls into view, the numeric stats tick up
     from zero. Non-numeric stats (e.g. "3–5×") are left untouched.
     If motion is reduced or IntersectionObserver is missing, the final
     numbers are simply shown as written. */
  if (!prefersReduced && "IntersectionObserver" in window) {
    var statsEl = document.querySelector(".stats");
    if (statsEl) {
      var counters = statsEl.querySelectorAll(".num[data-count]");
      // Show 0 up front so the count-up is visible, not a flash of the final value.
      counters.forEach(function (el) {
        el.textContent = "0" + (el.getAttribute("data-suffix") || "");
      });

      var runCount = function (el) {
        var target = parseInt(el.getAttribute("data-count"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        var duration = 1300, start = null;
        var tick = function (ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          // ease-out so it decelerates into the final number
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };

      var statsIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            counters.forEach(runCount);
            statsIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      statsIO.observe(statsEl);
    }
  }

  /* --- 6. Reveal the metamorphosis dividers on scroll ----------------- */
  if (!prefersReduced && "IntersectionObserver" in window) {
    var dividers = document.querySelectorAll(".metamorph-divider");
    var divIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          divIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    dividers.forEach(function (el) { divIO.observe(el); });
  }

  /* --- 7. Filter the Selected Work cards ------------------------------
     Clicking a chip shows only the matching cards (or all). Pure
     show/hide — no cards are removed from the DOM, so it's reversible
     and screen-reader friendly. */
  var chips = document.querySelectorAll(".filterbar .chip");
  var caseCards = document.querySelectorAll(".case-grid .card");
  if (chips.length && caseCards.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var filter = chip.getAttribute("data-filter");
        chips.forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        caseCards.forEach(function (card) {
          var show = filter === "all" || card.getAttribute("data-cat") === filter;
          card.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* --- 8b. Shrink the sticky header once the page is scrolled --------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --- 8. Flip tiles (SEMI layers) ------------------------------------
     Hover and keyboard focus flip the tiles via CSS alone. This adds the
     two cases CSS can't cover: a tap on touch devices, and Enter/Space
     when a tile is focused. */
  var flips = document.querySelectorAll(".flip");
  if (flips.length) {
    var noHover = window.matchMedia && window.matchMedia("(hover: none)").matches;
    flips.forEach(function (card) {
      var toggle = function () { card.classList.toggle("is-flipped"); };
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      });
      // Only wire tap-to-flip on touch devices, so a desktop click doesn't
      // leave a card stuck flipped after the mouse moves away.
      if (noHover) card.addEventListener("click", toggle);
    });
  }

  /* --- 9. Pre-select "Context Brief request" when arriving via a brief CTA
     (links carry ?type=brief). */
  var cfType = document.getElementById("cf-type");
  if (cfType) {
    var q = window.location.search;
    var want = q.indexOf("type=brief") !== -1 ? "Context Brief request"
             : q.indexOf("type=officehours") !== -1 ? "Founder office hours (innovators)"
             : null;
    if (want) {
      for (var ti = 0; ti < cfType.options.length; ti++) {
        if (cfType.options[ti].text === want) { cfType.selectedIndex = ti; break; }
      }
    }
  }
})();
