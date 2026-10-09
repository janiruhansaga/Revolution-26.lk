/* ============================================================
   main.js — boot, loader, cursor, menu, reveals, rAF loop
   ------------------------------------------------------------
   A single requestAnimationFrame loop drives every animated
   value (scroll state + canvas render) to avoid layout thrash
   from multiple competing timers.
   ============================================================ */
(function () {
  'use strict';

  var body = document.body;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function pad3(n) { return ('00' + n).slice(-3); }

  /* ============================================================
     1. SINGLE ANIMATION LOOP
  ============================================================ */
  function loop() {
    Scroll.tick();     // scroll -> targets, captions, parallax, progress
    Engine.tick();     // eased frame draw onto the canvas
    tickCursor();
    requestAnimationFrame(loop);
  }

  /* ============================================================
     2. LOADER
  ============================================================ */
  function bootLoader() {
    var loader = document.getElementById('loader');
    var bar = document.getElementById('loaderBar');
    var pct = document.getElementById('loaderPct');
    var last = -1;

    function onProgress(p) {
      var v = Math.round(Math.max(0, Math.min(1, p)) * 100);
      if (v === last) return;
      last = v;
      if (bar) bar.style.transform = 'scaleX(' + (v / 100) + ')';
      if (pct) pct.textContent = v;
    }

    function finish() {
      onProgress(1);
      setTimeout(function () {
        if (loader) loader.classList.add('is-done');
        body.classList.remove('is-loading');
        body.classList.add('is-ready');
        Scroll.measure();
      }, 380);
    }

    var safety = setTimeout(finish, 9000); // never trap the user

    if (window.Engine && Engine.init) {
      Engine.init(onProgress).then(function () {
        clearTimeout(safety);
        finish();
      });
    } else {
      clearTimeout(safety);
      finish();
    }
  }

  /* ============================================================
     3. SCROLL REVEALS (SYSTEM 2 — rest of the website)
  ============================================================ */
  function bootReveals() {
    var targets = $$('.reveal, [data-reveal], [data-reveal-lines]');
    if (!('IntersectionObserver' in window) || reduced) {
      targets.forEach(function (n) { n.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

    targets.forEach(function (n) { io.observe(n); });
  }

  /* ============================================================
     4. NAVIGATION + FULLSCREEN MENU
  ============================================================ */
  function bootNav() {
    var nav = document.getElementById('nav');
    var btn = document.getElementById('menuBtn');
    var menu = document.getElementById('menu');
    var label = btn ? btn.querySelector('.nav__btn-label') : null;
    var lastY = window.scrollY;

    function setMenu(open) {
      body.classList.toggle('menu-open', open);
      if (menu) menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (label) label.textContent = open ? (label.dataset.close || 'Close') : (label.dataset.open || 'Menu');
      if (nav) nav.classList.remove('is-hidden');
      if (open) {
        var first = menu && menu.querySelector('a');
        if (first) setTimeout(function () { first.focus(); }, 420);
      } else if (btn) {
        btn.focus({ preventScroll: true });
      }
    }

    if (btn) btn.addEventListener('click', function () {
      setMenu(!body.classList.contains('menu-open'));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && body.classList.contains('menu-open')) setMenu(false);
    });

    // hide-on-scroll-down, reveal-on-scroll-up (never while menu is open)
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (nav) {
        nav.classList.toggle('is-scrolled', y > 60);
        if (!body.classList.contains('menu-open')) {
          if (y > 240 && y - lastY > 6) nav.classList.add('is-hidden');
          else if (y - lastY < -6 || y < 240) nav.classList.remove('is-hidden');
        }
      }
      lastY = y;
    }, { passive: true });

    /* ---- cinematic smooth anchor scrolling ---- */
    var animating = null;

    function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

    function scrollToY(target) {
      if (reduced) { window.scrollTo(0, target); return; }
      var start = window.scrollY;
      var dist = target - start;
      if (Math.abs(dist) < 4) return;
      var dur = Math.min(1500, Math.max(520, Math.abs(dist) * 0.35));
      var t0 = performance.now();
      cancelScroll();

      function step(now) {
        var p = Math.min(1, (now - t0) / dur);
        window.scrollTo(0, start + dist * easeInOutCubic(p));
        if (p < 1) animating = requestAnimationFrame(step);
        else animating = null;
      }
      animating = requestAnimationFrame(step);
    }

    function cancelScroll() {
      if (animating) { cancelAnimationFrame(animating); animating = null; }
    }

    document.addEventListener('wheel', cancelScroll, { passive: true });
    document.addEventListener('touchstart', cancelScroll, { passive: true });

    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        if (body.classList.contains('menu-open')) setMenu(false);
        var top = target.getBoundingClientRect().top + window.scrollY;
        setTimeout(function () { scrollToY(top); }, body.classList.contains('menu-open') ? 300 : 0);
      });
    });
  }

  /* ============================================================
     5. CUSTOM CURSOR (desktop / fine pointer only)
  ============================================================ */
  var cursor, cDot, cRing, mx = -100, my = -100, rx = -100, ry = -100, cursorOn = false;

  function bootCursor() {
    if (!finePointer) return;
    cursor = document.getElementById('cursor');
    cDot = cursor && cursor.querySelector('.cursor__dot');
    cRing = cursor && cursor.querySelector('.cursor__ring');
    if (!cursor) return;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!cursorOn) { cursorOn = true; cursor.classList.add('is-on'); rx = mx; ry = my; }
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      cursorOn = false; cursor.classList.remove('is-on');
    });
    document.addEventListener('mousedown', function () { cursor.classList.add('is-down'); });
    document.addEventListener('mouseup', function () { cursor.classList.remove('is-down'); });

    // expand over interactive elements
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button, [data-cursor]')) cursor.classList.add('is-active');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button, [data-cursor]')) cursor.classList.remove('is-active');
    });
  }

  function tickCursor() {
    if (!cursorOn || !cRing) return;
    // ring trails the pointer with a soft lag
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    cDot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0) translate(-50%,-50%)';
    cRing.style.transform = 'translate3d(' + rx.toFixed(2) + 'px,' + ry.toFixed(2) + 'px,0) translate(-50%,-50%)';
  }

  /* ============================================================
     6. MAGNETIC BUTTON
  ============================================================ */
  function bootMagnetic() {
    if (!finePointer || reduced) return;
    $$('.btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = 'translate3d(' + (dx * 0.14).toFixed(2) + 'px,' + (dy * 0.3 - 4).toFixed(2) + 'px,0)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ============================================================
     7. HUD FRAME COUNTER
  ============================================================ */
  function bootHud() {
    var hud = document.getElementById('hudFrame');
    if (!hud || !window.Engine || !Engine.on) return;
    var last = -1;
    Engine.on('frame', function (i) {
      if (i === last) return;
      last = i;
      hud.textContent = pad3(i + 1);
    });
  }

  /* ============================================================
     8. PAGE TRANSITION — Enter the Revolution → /register
  ============================================================ */
  function bootEnter() {
    var overlay = document.getElementById('tOverlay');
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-enter]');
      if (!a) return;
      e.preventDefault();
      var url = a.getAttribute('href');
      if (!url || !overlay || reduced) { window.location.href = url || 'register/'; return; }
      overlay.classList.add('is-exiting');
      setTimeout(function () { window.location.href = url; }, 640);
    });
  }

  /* ============================================================
     BOOT
  ============================================================ */
  Scroll.init();
  bootReveals();
  bootNav();
  bootCursor();
  bootMagnetic();
  bootHud();
  bootEnter();
  bootLoader();
  requestAnimationFrame(loop);
})();
