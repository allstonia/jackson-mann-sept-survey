/*! Jackson Mann survey graphics — embed loader.
    Usage on the host page (one script tag, any number of placeholders):

      <div data-jm-chart="1-proposals-a-b"></div>
      <div data-jm-chart="4-additional-uses"></div>
      <script src="https://YOUR-ACCOUNT.github.io/YOUR-REPO/embed.js" async></script>

    Each placeholder becomes a full-width iframe that resizes itself to its
    content, on desktop and on mobile. No other markup or CSS is needed.        */
(function () {
  "use strict";

  // Where this script lives — the HTML files sit beside it.
  var me = document.currentScript || (function () {
    var s = document.getElementsByTagName("script");
    return s[s.length - 1];
  })();
  var BASE = (me && me.src ? me.src : "").replace(/[^/]*$/, "");

  // First-paint heights, so the page does not jump before the real height lands.
  var GUESS = {
    "1-proposals-a-b": 430,
    "2-swing-space": 560,
    "3-school-vs-housing": 760,
    "4-additional-uses": 900
  };
  var TITLE = {
    "1-proposals-a-b": "How Allston-Brighton rated the two Jackson Mann proposals",
    "2-swing-space": "Moving BCYF to the Taft Building during construction",
    "3-school-vs-housing": "School or housing? How residents chose between the two proposals",
    "4-additional-uses": "Which additional uses should be added to the Jackson Mann site?"
  };

  var frames = [];   // {el, id, reported}

  function mount(el) {
    if (el.getAttribute("data-jm-mounted")) return;
    var id = el.getAttribute("data-jm-chart");
    if (!id) return;
    el.setAttribute("data-jm-mounted", "1");

    var f = document.createElement("iframe");
    f.src = BASE + id + ".html";
    f.title = el.getAttribute("data-jm-title") || TITLE[id] || "Survey graphic";
    // Eager by default. These files are ~15 KB each with no external requests,
    // so lazy-loading saves nothing worth having — and a lazy iframe that never
    // trips its load threshold leaves a blank box where the chart should be.
    // Opt in with data-jm-lazy on the placeholder if you really want it.
    if (el.hasAttribute("data-jm-lazy")) f.loading = "lazy";
    f.setAttribute("scrolling", "no");
    f.style.cssText = "width:100%;border:0;display:block;overflow:hidden;" +
                      "height:" + (GUESS[id] || 600) + "px";
    el.appendChild(f);
    var rec = { el: f, id: id, reported: false };
    frames.push(rec);
    watch(rec);
  }

  // Safety net: if a frame has not reported a height, reload it once. Covers a
  // load that silently failed, and costs nothing when everything is fine.
  function watch(rec) {
    setTimeout(function () {
      if (rec.reported || rec.retried) return;
      rec.retried = true;
      var src = rec.el.src;
      rec.el.src = src;
    }, 4000);
  }

  function scan() {
    var els = document.querySelectorAll("[data-jm-chart]");
    for (var i = 0; i < els.length; i++) mount(els[i]);
  }

  window.addEventListener("message", function (e) {
    var d = e.data;
    if (!d || !d.jacksonMannEmbed || typeof d.height !== "number") return;
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].el.contentWindow === e.source) {
        frames[i].reported = true;
        frames[i].el.style.height = Math.max(120, d.height) + "px";
        return;
      }
    }
  });

  // Ask every frame to re-report after the host page settles or the column
  // width changes — covers lazy-loaded layouts and orientation changes.
  function ping() {
    for (var i = 0; i < frames.length; i++) {
      try { frames[i].el.contentWindow.postMessage({ jacksonMannPing: 1 }, "*"); } catch (err) {}
    }
  }
  var t;
  window.addEventListener("resize", function () {
    clearTimeout(t); t = setTimeout(ping, 180);
  });
  window.addEventListener("orientationchange", function () { setTimeout(ping, 350); });

  scan();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan);
  }
  window.addEventListener("load", function () { scan(); ping(); });
  // Elementor and similar builders can inject content after load.
  if (window.MutationObserver) {
    new MutationObserver(scan).observe(document.documentElement,
      { childList: true, subtree: true });
  }
})();
