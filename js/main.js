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

  /* ---------------- hero split-text reveal ---------------- */
  function runHeroReveal() {
    var lines = document.querySelectorAll('.hero-title .reveal-line, .hero-kicker, .hero-sub, .hero-scroll');
    if (!lines.length) return;
    if (hasGSAP && !reduceMotion) {
      gsap.set(lines, { opacity: 1 });
      gsap.from('.hero-title .reveal-line > *', {
        yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.08, delay: 0.15
      });
      gsap.from('.hero-kicker, .hero-sub, .hero-scroll', {
        opacity: 0, y: 16, duration: 0.9, ease: 'power2.out', stagger: 0.08, delay: 0.5
      });
    } else {
      lines.forEach(function (l) { l.style.opacity = 1; });
      document.querySelectorAll('.hero-title .reveal-line > *').forEach(function (el) {
        el.style.transform = 'none';
      });
    }
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
