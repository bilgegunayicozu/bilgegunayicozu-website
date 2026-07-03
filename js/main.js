/* Bilge Günay İçözü — portfolio interactivity */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  var hasGSAP = typeof window.gsap !== 'undefined';
  if (hasGSAP && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------------- smooth scroll (Lenis) ---------------- */
  var lenis = null;
  if (!reduceMotion && typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({ duration: 1.05, smoothWheel: true });
    lenis.on('scroll', function () {
      if (hasGSAP && window.ScrollTrigger) ScrollTrigger.update();
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (hasGSAP) {
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------------- preloader ---------------- */
  var preloader = document.querySelector('.preloader');
  if (preloader) {
    var fill = preloader.querySelector('.preloader-bar-fill');
    var countEl = preloader.querySelector('.preloader-count span');
    var pct = 0;
    var timer = setInterval(function () {
      pct += Math.random() * 18;
      if (pct >= 100) {
        pct = 100;
        clearInterval(timer);
        finishLoad();
      }
      if (fill) fill.style.width = pct + '%';
      if (countEl) countEl.textContent = Math.floor(pct);
    }, 120);

    function finishLoad() {
      setTimeout(function () {
        preloader.classList.add('is-done');
        document.body.classList.add('is-loaded');
        runHeroReveal();
        setTimeout(function () { preloader.remove(); }, 700);
      }, 200);
    }
  } else {
    document.body.classList.add('is-loaded');
    runHeroReveal();
  }

  /* ---------------- custom cursor: single dot, red on hover ---------------- */
  var cursorDot = document.querySelector('.cursor-dot');
  if (cursorDot && window.matchMedia('(hover: hover)').matches) {
    document.documentElement.classList.add('has-cursor');
    window.addEventListener('mousemove', function (e) {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
    });

    var hoverEls = document.querySelectorAll('a, button, [data-cursor]');
    hoverEls.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursorDot.classList.add('is-active');
      });
      el.addEventListener('mouseleave', function () {
        cursorDot.classList.remove('is-active');
      });
    });

    document.addEventListener('mouseleave', function () {
      cursorDot.classList.add('is-hidden');
    });
    document.addEventListener('mouseenter', function () {
      cursorDot.classList.remove('is-hidden');
    });
  }

  /* ---------------- magnetic buttons ---------------- */
  var magnets = document.querySelectorAll('[data-magnetic]');
  magnets.forEach(function (el) {
    if (reduceMotion) return;
    el.addEventListener('mousemove', function (e) {
      var b = el.getBoundingClientRect();
      var relX = e.clientX - b.left - b.width / 2;
      var relY = e.clientY - b.top - b.height / 2;
      el.style.transform = 'translate(' + relX * 0.28 + 'px,' + relY * 0.35 + 'px)';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transform = 'translate(0,0)';
    });
  });

  /* ---------------- header show/hide + scroll progress ---------------- */
  var header = document.querySelector('.site-header');
  var progress = document.querySelector('.scroll-progress');
  var lastY = window.scrollY;

  function onScroll() {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle('is-scrolled', y > 40);
      if (y > lastY && y > 160) header.classList.add('is-hidden');
      else header.classList.remove('is-hidden');
    }
    if (progress) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- theme switcher ---------------- */
  var themeButtons = document.querySelectorAll('.theme-toggle');
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    themeButtons.forEach(function (btn) {
      btn.textContent = theme === 'light' ? 'Dark' : 'Light';
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    });
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }
  var storedTheme = 'dark';
  try { storedTheme = localStorage.getItem('theme') || 'dark'; } catch (e) {}
  applyTheme(storedTheme);
  themeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
    });
  });

  /* ---------------- mobile nav toggle ---------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('is-open');
      nav.classList.toggle('is-open');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navToggle.classList.remove('is-open');
        nav.classList.remove('is-open');
      });
    });
  }

  /* ---------------- active nav link ---------------- */
  var here = location.pathname.split('/').pop() || 'index.html';
  var inWork = location.pathname.indexOf('/work/') !== -1;
  document.querySelectorAll('.nav a[data-path]').forEach(function (a) {
    var path = a.getAttribute('data-path');
    if (path === here || (path === 'index.html' && inWork)) a.classList.add('is-active');
  });

  /* ---------------- hero text reveal ---------------- */
  function runHeroReveal() {
    var lines = document.querySelectorAll('.hero-kicker, .hero-sub');
    if (!lines.length) return;
    if (hasGSAP && !reduceMotion) {
      gsap.set(lines, { opacity: 1 });
      gsap.from('.hero-kicker, .hero-sub', {
        opacity: 0, y: 18, duration: 1, ease: 'power2.out', stagger: 0.12, delay: 0.25
      });
    } else {
      lines.forEach(function (l) { l.style.opacity = 1; });
    }
  }

  /* ---------------- hero image cursor reveal (canvas: noisy blob + fading trail) ---------------- */
  var heroEl = document.querySelector('.hero');
  var heroCanvas = document.querySelector('canvas.hero-image-reveal');
  var heroBaseImg = document.querySelector('.hero-image-base');
  if (heroEl && heroCanvas && heroBaseImg && window.matchMedia('(hover: hover)').matches) {
    (function () {

      /* ================= REVEAL EFFECT SETTINGS — tweak freely =================
         NOISE_SPEED  how fast the blob edge morphs        0.004 slow … 0.04 fast
         NOISE_AMOUNT how irregular the edge is            0 circle  … 0.3 wild
         BLOB_RADIUS  size of the reveal, in CSS pixels
         TRAIL_FADE   how quickly the trail dissolves      0.02 long … 0.12 short
         EDGE_SOFT    extra blur over the whole reveal, px 0 crisp   … 30 misty
         FOLLOW       how tightly it chases the cursor     0.05 floaty … 0.3 tight
         GRAIN        rim speckles per frame               0 none    … 8 gritty
      ========================================================================== */
      var NOISE_SPEED  = 0.010;
      var NOISE_AMOUNT = 0.11;
      var BLOB_RADIUS  = 160;
      var TRAIL_FADE   = 0.045;
      var EDGE_SOFT    = 16;
      var FOLLOW       = 0.14;
      var GRAIN        = 3;

      var ctx = heroCanvas.getContext('2d');
      var maskCanvas = document.createElement('canvas');
      var mctx = maskCanvas.getContext('2d');
      var MASK_SCALE = 0.25; /* low-res mask = soft edges for free */
      var W = 0, H = 0;

      var img = new Image();
      img.src = heroBaseImg.currentSrc || heroBaseImg.src;

      function resize() {
        W = heroEl.clientWidth;
        H = heroEl.clientHeight;
        if (!W || !H) return;
        heroCanvas.width = W;
        heroCanvas.height = H;
        maskCanvas.width = Math.max(2, Math.round(W * MASK_SCALE));
        maskCanvas.height = Math.max(2, Math.round(H * MASK_SCALE));
      }
      resize();
      window.addEventListener('resize', resize);
      if ('ResizeObserver' in window) new ResizeObserver(resize).observe(heroEl);

      /* cover-fit draw, like CSS object-fit: cover */
      function drawCover(c, w, h) {
        if (!img.naturalWidth) return;
        var s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
        var dw = img.naturalWidth * s, dh = img.naturalHeight * s;
        c.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      }

      var tx = -9999, ty = -9999, cx = -9999, cy = -9999, active = false, t = 0;

      heroEl.addEventListener('mousemove', function (e) {
        var r = heroEl.getBoundingClientRect();
        tx = e.clientX - r.left;
        ty = e.clientY - r.top;
        if (!active) { cx = tx; cy = ty; }
        active = true;
      });
      heroEl.addEventListener('mouseleave', function () { active = false; });

      /* irregular, slowly-morphing blob stamped into the mask.
         alpha is shared across the stroke so overlapping stamps
         melt into one continuous shape instead of visible circles */
      function stampBlob(x, y, r, alpha) {
        var pts = 30;
        mctx.beginPath();
        for (var i = 0; i <= pts; i++) {
          var a = (i / pts) * Math.PI * 2;
          var wob = Math.sin(a * 3 + t * 1.0) * (NOISE_AMOUNT * 0.6)
                  + Math.sin(a * 5 - t * 1.6) * (NOISE_AMOUNT * 0.3)
                  + Math.sin(a * 7 + t * 2.2) * (NOISE_AMOUNT * 0.1);
          var rr = r * (1 + wob);
          var px = x + Math.cos(a) * rr;
          var py = y + Math.sin(a) * rr;
          if (i === 0) mctx.moveTo(px, py); else mctx.lineTo(px, py);
        }
        mctx.closePath();
        var g = mctx.createRadialGradient(x, y, r * 0.05, x, y, r * 1.1);
        g.addColorStop(0, 'rgba(255,255,255,' + (alpha).toFixed(3) + ')');
        g.addColorStop(0.6, 'rgba(255,255,255,' + (alpha * 0.55).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        mctx.fillStyle = g;
        mctx.fill();

        /* grain: a few soft freckles near the rim (they inherit the blur pass) */
        for (var n = 0; n < GRAIN; n++) {
          var na = Math.random() * Math.PI * 2;
          var nd = r * (0.85 + Math.random() * 0.5);
          var nr = r * (0.06 + Math.random() * 0.08);
          mctx.beginPath();
          mctx.arc(x + Math.cos(na) * nd, y + Math.sin(na) * nd, nr, 0, Math.PI * 2);
          mctx.fillStyle = 'rgba(255,255,255,' + (alpha * (0.15 + Math.random() * 0.2)).toFixed(3) + ')';
          mctx.fill();
        }
      }

      var visible = true;
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
        }, { threshold: 0.02 }).observe(heroEl);
      }

      var supportsFilter = typeof mctx.filter === 'string';

      (function loop() {
        requestAnimationFrame(loop);
        if (!visible || !W) return;
        t += NOISE_SPEED * 2.6;

        /* trail: fade the whole mask a little every frame */
        mctx.globalCompositeOperation = 'destination-out';
        mctx.fillStyle = 'rgba(0,0,0,' + TRAIL_FADE + ')';
        mctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        mctx.globalCompositeOperation = 'source-over';

        if (active) {
          /* dense, low-alpha stamps along the path: overlaps fuse into
             one fluid shape rather than a chain of visible circles */
          var px = cx, py = cy;
          cx += (tx - cx) * FOLLOW;
          cy += (ty - cy) * FOLLOW;
          var dist = Math.hypot(cx - px, cy - py);
          var steps = Math.min(10, Math.max(1, Math.ceil(dist / (BLOB_RADIUS * 0.12))));
          var alpha = 0.5 / Math.sqrt(steps);
          for (var i = 1; i <= steps; i++) {
            var ix = px + (cx - px) * (i / steps);
            var iy = py + (cy - py) * (i / steps);
            stampBlob(ix * MASK_SCALE, iy * MASK_SCALE, BLOB_RADIUS * MASK_SCALE, alpha);
          }
        }

        /* composite: sharp image, kept only where the mask glows.
           the blur pass melts stamps, edges and grain together */
        ctx.clearRect(0, 0, W, H);
        drawCover(ctx, W, H);
        ctx.globalCompositeOperation = 'destination-in';
        ctx.imageSmoothingEnabled = true;
        if (supportsFilter && EDGE_SOFT > 0) ctx.filter = 'blur(' + EDGE_SOFT + 'px)';
        ctx.drawImage(maskCanvas, 0, 0, W, H);
        ctx.filter = 'none';
        ctx.globalCompositeOperation = 'source-over';
      })();
    })();
  }

  /* ---------------- scroll reveals ---------------- */
  if (hasGSAP && window.ScrollTrigger && !reduceMotion) {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 46 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    gsap.utils.toArray('.work-card').forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%' }
      });
    });

    gsap.utils.toArray('.gallery-grid figure').forEach(function (el, i) {
      gsap.fromTo(el, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: (i % 3) * 0.06,
        scrollTrigger: { trigger: el, start: 'top 96%' }
      });
    });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  /* ---------------- sliders ---------------- */
  var sliders = document.querySelectorAll('[data-slider]');
  sliders.forEach(function (slider) {
    var track = slider.querySelector('.slider-track');
    var prevButton = slider.querySelector('.slider-arrow--prev');
    var nextButton = slider.querySelector('.slider-arrow--next');
    var dotsContainer = slider.parentElement.querySelector('.slider-dots');
    var dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];
    var total = track ? track.children.length : 0;
    if (!track || total === 0) return;

    var current = 0;
    var intervalId = null;

    function update(index) {
      current = (index + total) % total;
      track.style.transform = 'translateX(-' + current * 100 + '%)';
      dots.forEach(function (dot, i) { dot.classList.toggle('active', i === current); });
    }
    function next() { update(current + 1); }
    function prev() { update(current - 1); }
    function startAuto() {
      if (!slider.hasAttribute('data-autoplay') || total < 2 || reduceMotion) return;
      stopAuto();
      intervalId = setInterval(next, 3400);
    }
    function stopAuto() {
      if (intervalId) { clearInterval(intervalId); intervalId = null; }
    }

    if (prevButton) prevButton.addEventListener('click', function () { prev(); stopAuto(); startAuto(); });
    if (nextButton) nextButton.addEventListener('click', function () { next(); stopAuto(); startAuto(); });
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        update(Number(dot.dataset.slideTo || 0));
        stopAuto(); startAuto();
      });
    });
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    update(0);
    startAuto();
  });

  /* ---------------- hover-preview video on work cards ---------------- */
  document.querySelectorAll('.work-card-media video').forEach(function (v) {
    var card = v.closest('.work-card');
    if (!card) return;
    card.addEventListener('mouseenter', function () { v.play().catch(function () {}); });
    card.addEventListener('mouseleave', function () { v.pause(); });
  });
})();
