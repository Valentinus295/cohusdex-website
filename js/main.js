/* ============================================
   COHUSDEX — JavaScript
   Navigation · Scroll Reveals · Counter · FAQ
   ============================================ */

(function () {
  'use strict';

  // --- NAVIGATION ---
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navMobile = document.getElementById('navMobile');

  // Scroll shadow on nav
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile menu toggle
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMobile.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    var mobileLinks = navMobile.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navMobile.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMobile.classList.contains('open')) {
        navMobile.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && navMobile.classList.contains('open')) {
        navMobile.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- SMOOTH SCROLL (with nav offset) ---
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = nav.offsetHeight + 16;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // --- INTERSECTION OBSERVER: REVEAL ANIMATIONS ---
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -48px 0px'
    });

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all elements
    reveals.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- WORKER COUNTER (animated number) ---
  var workerEl = document.getElementById('workerCount');
  var workerTarget = 0;
  var workerDone = false;

  function animateCounter(el, target, duration) {
    if (target === 0) {
      el.textContent = '0';
      return;
    }
    var start = 0;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      // Ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  // Try to fetch live worker count from API
  if (workerEl) {
    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, 5000);

    fetch('https://api.cohusdex.com/api/v1/dashboard', { signal: controller.signal })
      .then(function (r) {
        clearTimeout(timeoutId);
        return r.json();
      })
      .then(function (data) {
        if (data && typeof data.workers === 'number' && data.workers >= 0) {
          workerTarget = data.workers;
        }
      })
      .catch(function () {
        // API unavailable — graceful fallback, counter stays at 0
      });

    // Observe counter section to trigger animation
    if ('IntersectionObserver' in window) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !workerDone) {
            workerDone = true;
            // If API hasn't returned yet, still animate from 0 for visual effect
            setTimeout(function () {
              animateCounter(workerEl, workerTarget, 2000);
            }, 300);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      counterObserver.observe(workerEl);
    }
  }

  // --- FAQ ACCORDION: auto-close others ---
  var faqItems = document.querySelectorAll('.faq__item');
  if (faqItems.length > 0) {
    faqItems.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (this.open) {
          faqItems.forEach(function (other) {
            if (other !== item && other.open) {
              other.open = false;
            }
          });
        }
      });
    });
  }

  // --- CONTACT FORM: basic validation ---
  var contactForm = document.querySelector('.contact__form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      var name = document.getElementById('name');
      var email = document.getElementById('email');
      var message = document.getElementById('message');
      var valid = true;

      if (name && !name.value.trim()) {
        name.style.borderColor = '#DC2626';
        valid = false;
      }
      if (email && (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value))) {
        email.style.borderColor = '#DC2626';
        valid = false;
      }
      if (message && !message.value.trim()) {
        message.style.borderColor = '#DC2626';
        valid = false;
      }

      if (!valid) {
        e.preventDefault();
      }
    });

    // Clear error styling on input
    var formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(function (input) {
      input.addEventListener('input', function () {
        this.style.borderColor = '';
      });
    });
  }

  // --- DATES: update copyright year dynamically ---
  var copyEl = document.querySelector('.footer__copy');
  if (copyEl) {
    var year = new Date().getFullYear();
    copyEl.textContent = copyEl.textContent.replace('2026', year);
  }

})();
