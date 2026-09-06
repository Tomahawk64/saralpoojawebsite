// Saral Pooja — shared site behaviour

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
      });
    });
  }

  // Contact form — sends through EmailJS.
  // Autoreply to the sender is handled entirely by the EmailJS template/dashboard
  // settings, so nothing extra is needed here for that part.
  var form = document.getElementById('contact-form');
  if (form) {
    var successBox = document.getElementById('contact-success');
    var errorBox = document.getElementById('contact-error');
    var submitBtn = form.querySelector('button[type="submit"]');

    var cfg = (window.SARAL_POOJA_CONFIG && window.SARAL_POOJA_CONFIG.emailjs) || {};
    var looksReal = function (v) {
      return !!v && v.indexOf('your_') !== 0;
    };
    var isConfigured = looksReal(cfg.publicKey) && looksReal(cfg.serviceId) && looksReal(cfg.templateId);

    if (isConfigured && window.emailjs) {
      window.emailjs.init({ publicKey: cfg.publicKey });
    }

    var show = function (el) { if (el) el.classList.add('show'); };
    var hide = function (el) { if (el) el.classList.remove('show'); };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hide(successBox);
      hide(errorBox);

      if (!isConfigured || !window.emailjs) {
        if (errorBox) {
          errorBox.textContent = 'Email sending isn\'t configured yet. Add your EmailJS credentials to .env, then run "node scripts/generate-config.js" (see README.md).';
          show(errorBox);
        }
        console.warn('[Saral Pooja] EmailJS is not configured — see .env and scripts/generate-config.js.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.dataset.originalText || submitBtn.textContent;
        submitBtn.textContent = 'Sending…';
      }

      window.emailjs.sendForm(cfg.serviceId, cfg.templateId, form).then(
        function () {
          show(successBox);
          form.reset();
        },
        function (err) {
          console.error('[Saral Pooja] EmailJS send failed:', err);
          if (errorBox) {
            errorBox.textContent = 'Something went wrong sending your message. Please try again, or email us directly at saralpooja.info@gmail.com.';
            show(errorBox);
          }
        }
      ).then(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.originalText;
        }
      });
    });
  }
});
