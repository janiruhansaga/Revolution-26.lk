/* ============================================================
   scroll.js — scroll orchestration
   ------------------------------------------------------------
   SYSTEM 1 (hero only) — CINEMATIC SCROLL CONTROLLER
     .hero is a 300vh scroll wrapper; .hero__sticky pins the
     viewport for its whole length. While pinned, the page does
     not visually move — scroll distance is converted 1:1 into a
     dedicated cinematic progress value (0 → 1, interpolated on
     rAF), which drives the 240-frame sequence. The final frame
     is reached at CINE_HOLD and held until the wrapper ends, so
     the next section can only appear after the sequence is
     complete. Fully bidirectional (wheel, touch, keys, scrollbar).

   SYSTEM 2 (rest of page): progress rail, chapter counter,
     parallax. Reveals are IntersectionObserver (main.js).
   ============================================================ */
(function () {
  'use strict';

  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var smooth = function (v, a, b) { return clamp((v - a) / (b - a), 0, 1); };

  var el = {};
  var vh = window.innerHeight;
  var docH = 0;
  var y = 0;
  var lastChapter = '';
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // hero pinned range (absolute px): [top, top + wrapperHeight - viewport]
  var heroRange = { s: 0, e: 1 };

  /* ----------------------------------------------------------
     Cinematic progress controller
     raw   = scroll-derived progress (authoritative, clamped)
     p     = interpolated progress the sequence actually uses
     live  = false while the hero is off-screen (re-snaps on entry)
     scrolled = user has scrolled at least once (load-in reveals
                own the untouched hero; we never fight them)
  ---------------------------------------------------------- */
  var cine = { raw: 0, p: 0, live: false, t: 0, scrolled: false };
  var CINE_HOLD = 0.92;  // final frame reached here, held until p = 1
  var CINE_TAU = 0.07;   // interpolation time constant (s)

  /* ----------------------------------------------------------
     HERO TEXT TIMELINE — single source of truth for every
     overlay on the sequence. Ranges are cinematic progress
     values; the SAME value drives frames, HUD bar and text.
     Frame landmarks (frame = p / 0.92 * 239):
       f 1–41   bright light-bar opening      → opening
       f 43–90  camera motion                 → revolution title
       f 93–165 dark quiet "king focus"       → chapter card + beats
       f 169–240 board-glow climax (peak f189)→ checkmate + finale
     `in` fades a phase up (with a small rise), `out` dissolves
     it (drifting up); adjacent phases crossfade by overlapping
     the end of one with the start of the next. Phases without
     `in` are visible from the start (opening) or hold to the
     end (finale).
  ---------------------------------------------------------- */
  var heroTimeline = {
    opening:    { out: [0.05, 0.14] },
    revolution: { in: [0.17, 0.235], out: [0.30, 0.36] },
    kingsMove:  { in: [0.37, 0.415], out: [0.435, 0.465] },
    king:       { in: [0.455, 0.485], out: [0.505, 0.535] },
    board:      { in: [0.525, 0.555], out: [0.58, 0.61] },
    move:       { in: [0.60, 0.63], out: [0.655, 0.685] },
    pieces:     { in: [0.675, 0.705], out: [0.72, 0.75] },
    checkmate:  { in: [0.745, 0.785], out: [0.87, 0.915] },
    finale:     { in: [0.90, 0.95] }
  };
  var phaseKeys = Object.keys(heroTimeline);

  function phaseEnv(s, ph) {
    var op = 1, ty = 0;
    if (ph.in)  { var a = smooth(s, ph.in[0], ph.in[1]);  op *= a; ty += (1 - a) * 24; }
    if (ph.out) { var b = smooth(s, ph.out[0], ph.out[1]); op *= 1 - b;    ty -= b * 30; }
    return { op: op, ty: ty };
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function isReady() { return document.body.classList.contains('is-ready'); }

  /* Exact viewport px for the sticky box — keeps the pin geometry
     and the scroll math in agreement on every device (mobile
     toolbars, split views, zoom). */
  function syncViewport() {
    document.documentElement.style.setProperty('--vh', Math.round(window.innerHeight) + 'px');
  }

  /* Write-if-changed (avoids layout thrash on per-frame style writes).
     On the FIRST write we drop the load-reveal CSS transition: from
     that moment scroll owns the motion — otherwise delays like
     `.hero__tag { transition ... 1.35s }` would re-trigger on every
     frame and desynchronize the text from the sequence. */
  function stage(node, op, ty) {
    if (!node) return;
    if (node.__init === undefined) {
      node.__init = true;
      node.style.transition = 'none';
    }
    var vs = op.toFixed(3);
    if (node.__so !== vs) { node.style.opacity = vs; node.__so = vs; }
    var ts = 'translate3d(0,' + ty.toFixed(2) + 'px,0)';
    if (node.__st !== ts) { node.style.transform = ts; node.__st = ts; }
  }

  /* ----------------------------------------------------------
     Measure (once per resize / load — never per frame)
  ---------------------------------------------------------- */
  function measure() {
    vh = window.innerHeight;
    docH = document.documentElement.scrollHeight;

    if (el.hero) {
      var top = el.hero.getBoundingClientRect().top + window.scrollY;
      heroRange.s = top;
      heroRange.e = top + el.hero.offsetHeight - vh;
      if (heroRange.e <= heroRange.s) heroRange.e = heroRange.s + 1;
    }

    el.parallaxItems.forEach(function (item) {
      var r = item.node.getBoundingClientRect();
      item.center = r.top + window.scrollY + r.height / 2;
      item.speed = parseFloat(item.node.getAttribute('data-parallax')) || 0.08;
    });

    el.chapters = $$('[data-sec]').map(function (node) {
      return {
        num: node.getAttribute('data-sec'),
        top: node.getBoundingClientRect().top + window.scrollY
      };
    });
  }

  /* ----------------------------------------------------------
     SYSTEM 1 — per-frame hero update (s = cinematic progress)
  ---------------------------------------------------------- */
  function heroTick(s) {
    // frames: floor(progress/HOLD * 239) — the last frame is
    // reached at p=0.92 and HOLDS until the wrapper releases.
    var fp = clamp(s / CINE_HOLD, 0, 1);
    Engine.setFrame(Math.floor(fp * (Engine.COUNT - 1)));

    // camera: settles in from a slight push, then a final slow push-in
    Engine.setZoom(1.07 - 0.07 * smooth(s, 0, 0.35) + 0.05 * smooth(s, 0.78, 1));

    // scrim: dark opening for the typography → image reveal → darker finale
    var scrim = s < 0.30
      ? 1 - 0.58 * smooth(s, 0.02, 0.30)
      : 0.42 + 0.30 * smooth(s, 0.72, 0.95);
    if (el.scrim) el.scrim.style.opacity = scrim.toFixed(3);

    // cinematic text phases — one timeline, one progress value.
    // Only after the first real scroll, so load-in reveals win
    // while the hero is untouched.
    if (cine.scrolled) {
      for (var k = 0; k < phaseKeys.length; k++) {
        var node = el.phases[phaseKeys[k]];
        if (!node) continue;
        var env = phaseEnv(s, heroTimeline[phaseKeys[k]]);
        stage(node, env.op, env.ty);
        // one-way flag: lets a phase's inner mask reveals play the
        // first time it becomes visible (never removed — scrubbing
        // back must not re-trigger them)
        if (env.op > 0.04 && !node.classList.contains('is-in')) node.classList.add('is-in');
      }
      stage(el.cue, 1 - smooth(s, 0, 0.06), 0);
    }

    // strategic gold lines draw in over the second half
    var lp = smooth(s, 0.42, 0.86);
    for (var i = 0; i < el.lines.length; i++) {
      var seg = smooth(lp, i * 0.13, i * 0.13 + 0.72);
      el.lines[i].style.strokeDashoffset = (1 - seg).toFixed(3);
    }

    // HUD: fades in with the first scroll; bar = exact progress,
    // hits 1.000 exactly when the hero releases.
    if (el.hudBar) el.hudBar.style.transform = 'scaleX(' + s.toFixed(4) + ')';
    if (el.hud) el.hud.style.opacity = smooth(s, 0.02, 0.10).toFixed(3);
  }

  /* ----------------------------------------------------------
     Per-frame update
  ---------------------------------------------------------- */
  function tick() {
    y = window.scrollY || window.pageYOffset || 0;

    /* ===== SYSTEM 1 — HERO ONLY (cinematic frames) ===== */
    var raw = clamp((y - heroRange.s) / (heroRange.e - heroRange.s), 0, 1);
    var heroVisible = y < heroRange.e + vh && y + vh > heroRange.s;

    // The sequence exists ONLY while the hero is on screen.
    // Outside it the engine stops drawing entirely.
    Engine.setActive(heroVisible);

    if (heroVisible && isReady()) {
      if (raw > 0.002) cine.scrolled = true;

      var now = performance.now();
      var dt = Math.min(0.1, (now - cine.t) / 1000);
      cine.t = now;

      // Interpolate the progress value (rAF, frame-rate independent).
      // Snap on first entry, on hero re-entry, on huge scrollbar jumps,
      // and for reduced-motion users — never let it drift or lag.
      if (!cine.live || reduced || Math.abs(raw - cine.p) > 0.3) cine.p = raw;
      else cine.p += (raw - cine.p) * (1 - Math.exp(-dt / CINE_TAU));
      cine.live = true;

      heroTick(cine.p);
    } else if (!heroVisible) {
      cine.live = false;
    }

    /* ===== SYSTEM 2 — rest of the page ===== */

    // parallax (subtle, desktop only)
    if (!isTouch) {
      for (var k = 0; k < el.parallaxItems.length; k++) {
        var it = el.parallaxItems[k];
        var off = (vh / 2 - it.center + y) * it.speed;
        it.node.style.transform = 'translate3d(0,' + off.toFixed(2) + 'px,0)';
      }
    }

    // progress rail + chapter counter
    var max = Math.max(1, docH - vh);
    el.progressFill.style.transform = 'scaleY(' + clamp(y / max, 0, 1).toFixed(4) + ')';

    var chapter = '01';
    for (var c = 0; c < el.chapters.length; c++) {
      if (y + vh * 0.5 >= el.chapters[c].top) chapter = el.chapters[c].num;
    }
    if (chapter !== lastChapter) {
      lastChapter = chapter;
      el.progressNum.textContent = chapter;
    }
  }

  /* ----------------------------------------------------------
     Boot
  ---------------------------------------------------------- */
  function init() {
    el.hero = document.getElementById('hero');
    el.content = document.getElementById('heroContent');
    el.phases = {};
    $$('[data-phase]').forEach(function (node) {
      el.phases[node.getAttribute('data-phase')] = node;
    });
    el.cue = $('.scroll-cue');
    el.scrim = $('.hero__scrim');
    el.lines = $$('.hero__lines [data-line]');
    el.hud = $('.hero__hud');
    el.hudBar = document.getElementById('hudBar');

    el.progressFill = document.getElementById('progressFill');
    el.progressNum = document.getElementById('progressNum');

    el.parallaxItems = $$('[data-parallax]').map(function (node) {
      return { node: node, center: 0, speed: 0.08 };
    });

    syncViewport();
    measure();
  }

  var resizeTimer;
  function onViewportChange() {
    syncViewport();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 160);
  }

  window.addEventListener('resize', onViewportChange, { passive: true });
  // mobile toolbar show/hide fires here (not always on window.resize)
  if (window.visualViewport) window.visualViewport.addEventListener('resize', onViewportChange, { passive: true });
  window.addEventListener('load', function () { syncViewport(); setTimeout(measure, 60); });

  window.Scroll = { init: init, measure: measure, tick: tick };
})();
