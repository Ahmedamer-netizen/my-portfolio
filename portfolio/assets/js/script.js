(function () {
  'use strict';

  // ===== Theme (Dark Mode) Toggle =====
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  function getStoredTheme() {
    return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    localStorage.setItem('theme', theme);
  }

  function initTheme() {
    const theme = getStoredTheme();
    setTheme(theme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  initTheme();

  // ===== Mobile Nav Toggle =====
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== Header scroll state =====
  const header = document.querySelector('.header');
  if (header) {
    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ===== Scroll reveal animation =====
  const revealEls = document.querySelectorAll('.section-title, .about-grid, .why-me-grid, .skills-grid, .projects-grid, .contact-items, .highlight-card, .why-me-card, .skill-category, .project-card');
  const revealOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        if (entry.target.classList.contains('project-card') || entry.target.classList.contains('highlight-card') || entry.target.classList.contains('why-me-card') || entry.target.classList.contains('skill-category')) {
          entry.target.style.transitionDelay = (entry.target.dataset.revealDelay || '0') + 'ms';
        }
      }
    });
  }, revealOptions);

  revealEls.forEach(function (el, i) {
    el.classList.add('reveal');
    if (el.classList.contains('project-card') || el.classList.contains('highlight-card') || el.classList.contains('why-me-card')) {
      el.dataset.revealDelay = (i % 3) * 100;
    }
    revealObserver.observe(el);
  });

  // ===== Footer year =====
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Projects: اضغط على الصورة = تكبير (lightbox)، اضغط على المنطقة = تبديل كود/واجهة =====
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightbox.hidden = false;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    requestAnimationFrame(function () { lightbox.dataset.open = 'true'; });
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.dataset.open = 'false';
    setTimeout(function () { lightbox.hidden = true; }, 300);
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox && lightbox.querySelector('.lightbox-backdrop')) {
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && lightbox.dataset.open === 'true') closeLightbox();
  });

  document.querySelectorAll('.project-preview-wrap').forEach(function (wrap) {
    var card = wrap.closest('.project-card');
    if (!card) return;
    function toggle() {
      card.classList.toggle('show-code');
    }
    wrap.addEventListener('click', function (e) {
      var img = e.target.closest('.project-view img');
      if (img && img.src) {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(img.src, img.alt || '');
        return;
      }
      toggle();
    });
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

})();
