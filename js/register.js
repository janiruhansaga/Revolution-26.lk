/* ============================================================
   REVOLUTION ’26 — REGISTRATION PORTAL
   renders everything from js/register-config.js, handles
   details panels, FAQ, smooth scroll, reveals, transitions.
   No canvas, no frame sequence — page stays fast.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var hasCfg = {
    links: typeof registrationLinks !== 'undefined',
    comps: typeof competitions !== 'undefined',
    dates: typeof eventDates !== 'undefined',
    faqs: typeof faqs !== 'undefined'
  };

  /* ---------- helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function resolveUrl(c) {
    if (hasCfg.links && registrationLinks[c.formKey]) return registrationLinks[c.formKey];
    return c.registrationUrl || '#';
  }
  var ARROW = '<svg class="rcard__arrow" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';

  /* ============================================================
     RENDER — competitions
  ============================================================ */
  function renderCompetitions() {
    var grid = $('#rGrid');
    if (!grid) return;
    if (!hasCfg.comps || !competitions.length) return;

    grid.innerHTML = competitions.map(function (c) {
      var url = resolveUrl(c);
      var d = c.details || {};
      var panelId = 'panel-' + c.id;

      var focus = (c.focus || []).map(function (f) {
        return '<li>' + esc(f) + '</li>';
      }).join('');

      function sec(head, body) {
        if (!body) return '';
        return '<div class="rcard__psec"><h4 class="rcard__ph">' + head + '</h4><p class="rcard__pp">' + esc(body) + '</p></div>';
      }

      return '' +
        '<article class="rcard reveal" id="comp-' + esc(c.id) + '" data-comp="' + esc(c.id) + '">' +
          '<span class="rcard__grid" aria-hidden="true"></span>' +
          '<header class="rcard__head">' +
            '<span class="rcard__num" aria-hidden="true">' + esc(c.number || '') + '</span>' +
            '<p class="rcard__tagline">' + esc(c.tagline || '') + '</p>' +
            '<h3 class="rcard__title">' + esc(c.title || '') + '</h3>' +
          '</header>' +
          '<div class="rcard__body">' +
            '<p class="rcard__desc">' + esc(c.description || '') + '</p>' +
            '<div class="rcard__focus">' +
              '<span class="rcard__focuslabel">Focus</span>' +
              '<ul>' + focus + '</ul>' +
            '</div>' +
            '<div class="rcard__actions">' +
              '<a class="btn" href="' + esc(url) + '" data-form="' + esc(c.formKey || c.id) + '"><span>Register now</span>' + ARROW + '</a>' +
              '<button class="rcard__details" type="button" aria-expanded="false" aria-controls="' + panelId + '">View details</button>' +
            '</div>' +
          '</div>' +
          '<div class="rcard__panel" id="' + panelId + '" role="region" aria-label="' + esc(c.title) + ' details">' +
            '<div class="rcard__panelin">' +
              sec('About the challenge', d.about) +
              sec('Who can participate', d.who) +
              sec('What you will need', d.need) +
              sec('Format', d.format) +
              sec('Judging', d.judging) +
              '<div class="rcard__regbar">' +
                '<div><h4 class="rcard__ph">Registration</h4><p class="rcard__pp">Official Google Form — opens in a new tab.</p></div>' +
                '<a class="btn" href="' + esc(url) + '" data-form="' + esc(c.formKey || c.id) + '"><span>Register for this challenge</span>' + ARROW + '</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</article>';
    }).join('');
  }

  /* ============================================================
     RENDER — move band nav (01 — PITCH …)
  ============================================================ */
  function renderMoveNav() {
    var nav = $('#moveNav');
    if (!nav || !hasCfg.comps) return;
    var shorts = {
      businessPitch: 'Pitch',
      entrepreneurshipQuiz: 'Quiz',
      aiProductInnovation: 'AI',
      popularSociety: 'Society'
    };
    nav.innerHTML = competitions.map(function (c) {
      var word = c.short || shorts[c.id] || c.title;
      return '<a href="#comp-' + esc(c.id) + '"><b>' + esc(c.number || '') + '</b><span aria-hidden="true">—</span><em>' + esc(word) + '</em></a>';
    }).join('');
  }

  /* ============================================================
     RENDER — dates + FAQ
  ============================================================ */
  function renderDates() {
    var list = $('#datesList');
    if (!list || !hasCfg.dates || !eventDates.length) return;
    var html = ['<span class="dates__line reveal" style="--d:.1s" aria-hidden="true"></span>'];
    eventDates.forEach(function (d, i) {
      if (i > 0) html.push('<li class="dates__arrow" aria-hidden="true">↓</li>');
      html.push(
        '<li class="dates__item reveal" style="--d:' + (0.15 + i * 0.12) + 's">' +
          '<span class="dates__label">' + esc(d.label) + '</span>' +
          '<span class="dates__dot" aria-hidden="true"></span>' +
          '<b class="dates__date">' + esc(d.date) + (d.placeholder ? '<em>Placeholder — editable in config</em>' : '') + '</b>' +
        '</li>'
      );
    });
    list.innerHTML = html.join('');
  }

  function renderFaq() {
    var list = $('#faqList');
    if (!list || !hasCfg.faqs || !faqs.length) return;
    list.innerHTML = faqs.map(function (f, i) {
      return '' +
        '<div class="faq__item reveal" style="--d:' + (i * 0.06) + 's">' +
          '<button class="faq__q" type="button" id="faq-q-' + i + '" aria-expanded="false" aria-controls="faq-a-' + i + '">' +
            '<span>' + esc(f.q) + '</span>' +
            '<span class="faq__icon" aria-hidden="true"></span>' +
          '</button>' +
          '<div class="faq__a" id="faq-a-' + i + '" role="region" aria-labelledby="faq-q-' + i + '">' +
            '<div><p>' + esc(f.a) + '</p></div>' +
          '</div>' +
        '</div>';
    }).join('');
  }

  /* ============================================================
     SMOOTH SCROLL (time-based easing, no hijack)
  ============================================================ */
  function navOffset() {
    var nav = $('#rnav');
    return (nav ? nav.offsetHeight : 84) + 10;
  }
  function scrollToY(targetY, dur) {
    targetY = Math.max(0, targetY);
    if (reduced) { window.scrollTo(0, targetY); return; }
    var startY = window.pageYOffset;
    var dist = targetY - startY;
    if (Math.abs(dist) < 2) return;
    var startTime = null;
    var D = dur || Math.min(1500, Math.max(550, Math.abs(dist) * 0.55));
    function step(ts) {
      if (startTime === null) startTime = ts;
      var t = Math.min(1, (ts - startTime) / D);
      var e = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      window.scrollTo(0, startY + dist * e);
      if (t < 1) requestAnimationFrame(step);
      else window.scrollTo(0, targetY);
    }
    requestAnimationFrame(step);
  }
  function scrollToHash(hash) {
    var el = document.querySelector(hash);
    if (!el) return;
    scrollToY(el.getBoundingClientRect().top + window.pageYOffset - navOffset());
  }

  /* ============================================================
     PAGE TRANSITIONS
  ============================================================ */
  function exitTo(url) {
    var o = $('#tOverlay');
    if (!o || reduced) { window.location.href = url; return; }
    o.classList.remove('is-revealing', 'is-covering');
    o.classList.add('is-exiting');
    setTimeout(function () { window.location.href = url; }, 640);
  }
  function revealPage() {
    var o = $('#tOverlay');
    document.body.classList.add('is-ready');
    if (!o) return;
    if (reduced) { o.classList.remove('is-covering'); return; }
    setTimeout(function () {
      o.classList.add('is-revealing');
      o.classList.remove('is-covering');
      setTimeout(function () { o.classList.remove('is-revealing'); }, 1000);
    }, 250);
  }

  /* ============================================================
     TITLE — letter-by-letter masked reveal
  ============================================================ */
  function splitTitle() {
    var h1 = $('#rTitle');
    if (!h1) return;
    var words = h1.textContent.trim().split(/\s+/);
    var idx = 0;
    h1.innerHTML = words.map(function (w) {
      var letters = w.split('').map(function (ch) {
        return '<i style="--i:' + (idx++) + '">' + esc(ch) + '</i>';
      }).join('');
      idx++;
      return '<span class="tmask"><span class="tword">' + letters + '</span></span>';
    }).join('');
  }

  /* ============================================================
     INTERACTIONS (delegated)
  ============================================================ */
  function bind() {
    document.addEventListener('click', function (e) {

      /* register buttons → single source links, new tab */
      var formLink = e.target.closest('[data-form]');
      if (formLink) {
        e.preventDefault();
        var key = formLink.getAttribute('data-form');
        var url = (hasCfg.links && registrationLinks[key]) ? registrationLinks[key] : formLink.getAttribute('href');
        if (url && url !== '#') window.open(url, '_blank', 'noopener');
        return;
      }

      /* details toggle */
      var det = e.target.closest('.rcard__details');
      if (det) {
        var card = det.closest('.rcard');
        var panel = card && card.querySelector('.rcard__panel');
        if (panel) {
          var open = panel.classList.toggle('is-open');
          det.setAttribute('aria-expanded', open ? 'true' : 'false');
          det.textContent = open ? 'Close details' : 'View details';
        }
        return;
      }

      /* FAQ — one open at a time */
      var q = e.target.closest('.faq__q');
      if (q) {
        var wasOpen = q.getAttribute('aria-expanded') === 'true';
        document.querySelectorAll('.faq__q').forEach(function (btn) {
          btn.setAttribute('aria-expanded', 'false');
          var p = document.getElementById(btn.getAttribute('aria-controls'));
          if (p) p.classList.remove('is-open');
        });
        if (!wasOpen) {
          q.setAttribute('aria-expanded', 'true');
          var panel2 = document.getElementById(q.getAttribute('aria-controls'));
          if (panel2) panel2.classList.add('is-open');
        }
        return;
      }

      /* exit transition back to landing */
      var exit = e.target.closest('[data-exit]');
      if (exit) {
        e.preventDefault();
        exitTo(exit.getAttribute('href'));
        return;
      }

      /* in-page anchors — smooth scroll with nav offset */
      var a = e.target.closest('a[href^="#"]');
      if (a && a.getAttribute('href').length > 1) {
        e.preventDefault();
        scrollToHash(a.getAttribute('href'));
        return;
      }
      if (a && a.hasAttribute('data-top')) {
        e.preventDefault();
        scrollToY(0);
      }
    });
  }

  /* ============================================================
     REVEALS + king edge draw
  ============================================================ */
  function observe() {
    var targets = document.querySelectorAll('.reveal, #finalKing');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -7% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ============================================================
     SCROLL FX — nav state + king parallax (single rAF)
  ============================================================ */
  function scrollFx() {
    var nav = $('#rnav');
    var king = $('#heroKing');
    var ticking = false;
    function update() {
      ticking = false;
      var y = window.pageYOffset;
      if (nav) nav.classList.toggle('is-scrolled', y > 32);
      if (king && !reduced) {
        if (y < window.innerHeight * 1.25) {
          king.style.setProperty('--pk', (y * 0.06).toFixed(1) + 'px');
        }
      }
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ============================================================
     BOOT
  ============================================================ */
  function boot() {
    splitTitle();
    renderCompetitions();
    renderMoveNav();
    renderDates();
    renderFaq();
    bind();
    observe();
    scrollFx();
    /* reveal early — never strand the visitor behind the cover,
       even if a later enhancement throws */
    setTimeout(revealPage, 180);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
