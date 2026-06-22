/* ═══════════════════════════════════════════════════════════════════════════
   CohusDex v2.0 — Shared JavaScript
   Navigation, scroll animations, counters, form handling, FAQ accordion
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Navigation ──────────────────────────────────────────────────────── */
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  let lastScroll = 0;

  function updateNav() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    lastScroll = scrollY;
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('nav--mobile-open');
      navToggle.classList.toggle('nav-toggle--open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav on link click
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('nav--mobile-open');
        navToggle.classList.remove('nav-toggle--open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── Scroll Reveal ───────────────────────────────────────────────────── */
  const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealOptions);

  document.querySelectorAll('.reveal, .reveal--fade').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ── Animated Counters ───────────────────────────────────────────────── */
  const counterOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, counterOptions);

  function animateCounter(el) {
    var target = el.getAttribute('data-count');
    if (!target) return;
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = parseInt(el.getAttribute('data-duration') || '2000');
    var isDecimal = target.indexOf('.') > -1;
    var targetNum = parseFloat(target);
    var startTime = null;
    var decimals = isDecimal ? target.split('.')[1].length : 0;

    function update(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = targetNum * eased;
      if (isDecimal) {
        el.textContent = prefix + current.toFixed(decimals) + suffix;
      } else {
        el.textContent = prefix + Math.floor(current) + suffix;
      }
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  document.querySelectorAll('[data-count]').forEach(function (el) {
    counterObserver.observe(el);
  });

  /* ── FAQ Accordion ───────────────────────────────────────────────────── */
  document.querySelectorAll('.faq-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = trigger.closest('.faq-item');
      var isOpen = item.classList.contains('faq-item--open');

      // Close all others
      document.querySelectorAll('.faq-item--open').forEach(function (open) {
        if (open !== item) open.classList.remove('faq-item--open');
      });

      item.classList.toggle('faq-item--open', !isOpen);
    });
  });

  /* ── Form Handling ────────────────────────────────────────────────────── */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Simulate sending (replace with actual endpoint)
      setTimeout(function () {
        showToast('Message sent! We\'ll reply within 24 hours.');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  var demoForm = document.getElementById('demo-form');
  if (demoForm) {
    demoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = demoForm.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Requesting...';
      submitBtn.disabled = true;

      setTimeout(function () {
        showToast('Demo request sent! Our team will reach out shortly.');
        demoForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  /* ── Toast Notification ──────────────────────────────────────────────── */
  function showToast(message) {
    var existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('toast--visible');
    });

    setTimeout(function () {
      toast.classList.remove('toast--visible');
      setTimeout(function () { toast.remove(); }, 300);
    }, 4000);
  }

  /* ── Smooth Scroll for anchor links ──────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var navHeight = document.querySelector('.nav').offsetHeight;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  /* ── Active nav link highlight ────────────────────────────────────────── */
  (function () {
    var currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkFile = href.split('/').pop();
      if (linkFile === currentPath) {
        link.classList.add('nav-link--active');
      } else if (currentPath === '' && linkFile === 'index.html') {
        link.classList.add('nav-link--active');
      }
    });
  })();

  /* ── Parallax glow follows mouse ─────────────────────────────────────── */
  var glowOrange = document.querySelector('.bg-glow--orange');
  if (glowOrange) {
    document.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 40;
      var y = (e.clientY / window.innerHeight - 0.5) * 20;
      glowOrange.style.transform = 'translate(calc(-50% + ' + x + 'px), ' + y + 'px)';
    }, { passive: true });
  }

})();
