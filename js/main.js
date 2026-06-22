/* ============================================
   CohusDex — Main JavaScript
   Minimal, mobile-first, no frameworks.
   ============================================ */

// --- Navigation Toggle ---
function toggleNav() {
  var nav = document.querySelector('.nav-links');
  var btn = document.querySelector('.nav-toggle');
  var isOpen = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen);
  btn.textContent = isOpen ? '✕' : '☰';
}

// Close nav when clicking a link (mobile)
document.querySelectorAll('.nav-links a').forEach(function(link) {
  link.addEventListener('click', function() {
    var nav = document.querySelector('.nav-links');
    var btn = document.querySelector('.nav-toggle');
    if (nav.classList.contains('open')) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = '☰';
    }
  });
});

// --- Contact Form ---
function handleSubmit(event) {
  // Form handles submission natively via Formspree or similar.
  // This is a fallback / enhancement.
  var form = document.getElementById('contactForm');
  if (!form) return true;

  // If no form action is configured (placeholder), show a message
  var action = form.getAttribute('action');
  if (!action || action.indexOf('your-form-id') > -1) {
    event.preventDefault();
    alert('Asante kwa ujumbe wako! / Thank you for your message!\n\nForm submission will be configured once deployed. For now, please email us directly at hello@cohusdex.com');
    form.reset();
    return false;
  }
  return true;
}

// --- Progressive Web App Registration ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(reg) {
      // Service worker registered successfully
    }).catch(function(err) {
      // Service worker registration failed — non-critical
    });
  });
}

// --- Smooth scroll for anchor links (progressive enhancement) ---
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
