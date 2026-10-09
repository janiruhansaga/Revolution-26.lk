/* ============================================================
   animation.js — Cinematic image-sequence engine
   ------------------------------------------------------------
   Renders the 240-frame chess sequence to a full-screen canvas.
   Scroll position -> target frame (set by scroll.js) is eased
   with an exponential lerp every animation frame, producing a
   smooth, video-scrub-like playback controlled by the user.
   ============================================================ */
(function () {
  'use strict';

  var BASE = window.FRAME_BASE || 'scrolling animation/';
  var LIST = window.FRAME_MANIFEST || [];
  var COUNT = LIST.length || 240;

  var canvas = document.getElementById('heroCanvas');
  var ctx = canvas ? canvas.getContext('2d', { alpha: false }) : null;

  var imgs = new Array(COUNT);        // Image objects (lazy, progressive)
  var status = new Uint8Array(COUNT); // 0 = pending, 1 = loaded, 2 = failed
  var decoded = new Set();            // frames warmed with img.decode()
  var queue = [];                     // pending frame indices
  var activeLoads = 0;
  var CONCURRENCY = 6;
  var CRITICAL = 30;                  // frames required before the loader clears

  var vw = 0, vh = 0, dpr = 1;

  // --- animated state (all values eased in render loop) ---
  var state = {
    targetFrame: 0,   // frame index requested by scroll.js
    frame: 0,         // eased frame position (float)
    alpha: 0,         // canvas opacity (0 = fully black)
    zoom: 1,          // cinematic scale (cover * zoom)
    focusX: 0.5,      // object-position style focal point
    focusY: 0.5,
    active: true,     // false = viewport shows an opaque section
    ready: false
  };

  var drawnFrame = -1;
  var drawnAlpha = -1;
  var drawnZoom = -1;
  var listeners = { frame: [], progress: [] };

  /* ----------------------------------------------------------
     Loading — progressive queue with priority jumps
  ---------------------------------------------------------- */
  function buildQueue() {
    queue = [];
    for (var i = 0; i < COUNT; i++) if (!status[i]) queue.push(i);
  }

  function startLoad(i) {
    if (status[i] || imgs[i]) return;
    var img = new Image();
    img.decoding = 'async';
    imgs[i] = img;
    activeLoads++;

    img.onload = function () {
      status[i] = 1;
      activeLoads--;
      emit('progress', loadedCritical() / CRITICAL);
      pump();
      // Warm-decode frames close to the playhead so drawImage never
      // triggers a synchronous decode mid-scroll.
      if (Math.abs(i - state.targetFrame) < 8) warmDecode(i);
    };
    img.onerror = function () {
      status[i] = 2;
      activeLoads--;
      pump();
    };
    img.src = BASE + LIST[i];
  }

  function pump() {
    while (activeLoads < CONCURRENCY && queue.length) {
      startLoad(queue.shift());
    }
  }

  function loadedCritical() {
    var n = 0;
    for (var i = 0; i < Math.min(CRITICAL, COUNT); i++) if (status[i] === 1) n++;
    return n;
  }

  function warmDecode(i) {
    if (decoded.has(i) || !imgs[i] || status[i] !== 1) return;
    decoded.add(i);
    if (typeof imgs[i].decode === 'function') {
      imgs[i].decode().catch(function () { /* ignore — drawImage will decode */ });
    }
  }

  /** Jump a small window of frames to the front of the download queue. */
  function prioritize(center) {
    var c = Math.round(center);
    for (var d = 0; d <= 8; d++) {
      step(c - d);
      step(c + d);
    }
    pump();
  }

  function step(i) {
    if (i < 0 || i >= COUNT) return;
    if (status[i] === 1) { warmDecode(i); return; }
    if (status[i] || imgs[i]) return;           // in flight or failed
    var at = queue.indexOf(i);
    if (at > 0) { queue.splice(at, 1); queue.unshift(i); }
  }

  /** Nearest successfully loaded frame, searching outward. */
  function nearestLoaded(i) {
    i = Math.max(0, Math.min(COUNT - 1, Math.round(i)));
    if (status[i] === 1) return i;
    for (var d = 1; d < COUNT; d++) {
      if (i - d >= 0 && status[i - d] === 1) return i - d;
      if (i + d < COUNT && status[i + d] === 1) return i + d;
    }
    return -1;
  }

  /* ----------------------------------------------------------
     Sizing — canvas is sized by CSS (100% of the hero's
     cinematic container), object-fit: cover in JS.
     DPR capped by a pixel budget so retina screens stay 60fps.
  ---------------------------------------------------------- */
  function resize() {
    if (!canvas || !ctx) return;
    var rect = canvas.getBoundingClientRect();
    vw = Math.round(rect.width) || window.innerWidth;
    vh = Math.round(rect.height) || window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    var budget = 6e6;
    var area = vw * vh * dpr * dpr;
    if (area > budget) dpr = Math.max(1, Math.sqrt(budget / (vw * vh)));

    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Force a repaint of the current frame at the new size.
    drawnFrame = drawnAlpha = drawnZoom = -1;
    if (state.ready) render(true);
  }

  function draw(index) {
    if (!ctx) return false;
    var img = imgs[index];
    if (!img || status[index] !== 1) return false;

    var iw = img.naturalWidth, ih = img.naturalHeight;
    if (!iw || !ih) return false;

    // object-fit: cover (eased zoom + focal point)
    var scale = Math.max(vw / iw, vh / ih) * (state.zoomCurrent || 1);
    var dw = iw * scale, dh = ih * scale;
    var dx = (vw - dw) * state.focusX;
    var dy = (vh - dh) * state.focusY;

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#050608';
    ctx.fillRect(0, 0, vw, vh);
    ctx.globalAlpha = state.alphaCurrent || 0;
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.globalAlpha = 1;
    return true;
  }

  /* ----------------------------------------------------------
     Render loop — exponential smoothing of frame/alpha/zoom
  ---------------------------------------------------------- */
  var lastRenderT = performance.now();

  function render(force) {
    var now = performance.now();
    var dt = Math.min(0.1, (now - lastRenderT) / 1000);
    lastRenderT = now;

    // Outside the hero the engine does NOTHING (no draws, no decodes)
    // and lands exactly on the target, so it can never freeze
    // mid-transition for the moment the hero scrolls back in.
    if (!state.active && !force) {
      state.frame = state.targetFrame;
      return false;
    }

    // Exponential smoothing, frame-rate independent.
    // Large jumps to the sequence's first/last frame snap instantly —
    // a scrollbar/end-key jump can never show the page next door with
    // the sequence still unfinished. Mid-sequence scrubbing stays soft
    // (~90ms) so no frames are ever skipped.
    var atEnd = state.targetFrame <= 0 || state.targetFrame >= COUNT - 1;
    if (atEnd && Math.abs(state.targetFrame - state.frame) > 20) {
      state.frame = state.targetFrame;
    }
    var kf = state.reduced ? 1 : 1 - Math.exp(-dt / (atEnd ? 0.04 : 0.09));
    var next = state.frame + (state.targetFrame - state.frame) * kf;
    // land exactly on the target when within half a frame
    state.frame = Math.abs(state.targetFrame - next) < 0.5 ? state.targetFrame : next;

    var kz = state.reduced ? 1 : 1 - Math.exp(-dt / 0.18);
    state.zoomCurrent = (state.zoomCurrent === undefined ? state.zoom : state.zoomCurrent);
    state.zoomCurrent += (state.zoom - state.zoomCurrent) * kz;

    // Cinematic fade-in: black → first frame over ~2.2s once ready.
    var alphaTarget = state.fadeStart
      ? Math.min(1, (now - state.fadeStart) / 2200)
      : 0;
    state.alphaCurrent = (state.alphaCurrent === undefined ? 0 : state.alphaCurrent);
    state.alphaCurrent += (alphaTarget - state.alphaCurrent) * (1 - Math.exp(-dt / 0.35));

    var idx = Math.round(state.frame);
    idx = Math.max(0, Math.min(COUNT - 1, idx));

    var zChanged = Math.abs(state.zoomCurrent - drawnZoom) > 0.0008;
    var aChanged = Math.abs(state.alphaCurrent - drawnAlpha) > 0.004;

    if (!force && idx === drawnFrame && !zChanged && !aChanged) return false;

    var show = nearestLoaded(idx);
    if (show === -1) return false;

    // keep downloads chasing the playhead
    if (Math.abs(idx - drawnFrame) > 1) prioritize(idx);

    if (!draw(show)) return false;

    drawnFrame = idx;
    drawnZoom = state.zoomCurrent;
    drawnAlpha = state.alphaCurrent;

    if (show !== lastEmitted) { lastEmitted = show; emit('frame', show); }
    return true;
  }

  var lastEmitted = -1;

  /* ----------------------------------------------------------
     Public API
  ---------------------------------------------------------- */
  window.Engine = {
    COUNT: COUNT,
    CRITICAL: CRITICAL,

    init: function (onProgress) {
      if (!LIST.length) return Promise.resolve();
      state.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      resize();
      buildQueue();
      pump();

      if (onProgress) { listeners.progress.push(onProgress); onProgress(0); }

      // Resolve once the first screenful of frames is usable
      // (never longer than 9s, so a slow/failed asset can't trap the user).
      return new Promise(function (resolve) {
        var settled = false;
        var t0 = performance.now();
        (function check() {
          var done = loadedCritical() >= Math.min(CRITICAL, COUNT);
          var elapsed = performance.now() - t0;
          if ((done && elapsed > 900) || elapsed > 9000) {
            settled = true;
            state.ready = true;
            state.fadeStart = performance.now();
            resolve();
            return;
          }
          if (!settled) requestAnimationFrame(check);
        })();
      });
    },

    resize: resize,

    /** Called every animation frame by main.js */
    tick: function () { return render(false); },

    /** scroll.js writes the desired frame / look here */
    setFrame: function (f) { state.targetFrame = Math.max(0, Math.min(COUNT - 1, f)); },
    setAlpha: function (a) { state.fadeStart = performance.now() - 2200 * Math.max(0, Math.min(1, a)); },
    setZoom: function (z) { state.zoom = z; },
    setFocus: function (x, y) { state.focusX = x; state.focusY = y; },
    setActive: function (v) { state.active = !!v; },

    get frame() { return Math.round(state.frame); },
    get progress() { return state.frame / (COUNT - 1); },

    on: function (type, fn) { if (listeners[type]) listeners[type].push(fn); }
  };

  function emit(type, value) {
    var arr = listeners[type];
    for (var i = 0; i < arr.length; i++) arr[i](value);
  }

  window.addEventListener('resize', debounce(resize, 160), { passive: true });

  function debounce(fn, ms) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  }
})();
