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

    // --- Client-side validation -------------------------------------------
    var fieldEl = function (name) { return form.querySelector('[name="' + name + '"]'); };
    var wrapOf = function (el) { return el ? el.closest('.form-field') : null; };
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var clearFieldErrors = function () {
      form.querySelectorAll('.form-field.field-invalid').forEach(function (w) {
        w.classList.remove('field-invalid');
      });
      form.querySelectorAll('[aria-invalid="true"]').forEach(function (el) {
        el.removeAttribute('aria-invalid');
      });
    };

    var markInvalid = function (el) {
      if (!el) return;
      el.setAttribute('aria-invalid', 'true');
      var w = wrapOf(el);
      if (w) w.classList.add('field-invalid');
    };

    var validate = function () {
      clearFieldErrors();
      var problems = [];
      var name = fieldEl('name');
      var email = fieldEl('email');
      var phone = fieldEl('phone');
      var message = fieldEl('message');

      if (name && !name.value.trim()) { markInvalid(name); problems.push('Please enter your full name.'); }

      if (email) {
        var ev = email.value.trim();
        if (!ev) { markInvalid(email); problems.push('Please enter your email address.'); }
        else if (!EMAIL_RE.test(ev)) { markInvalid(email); problems.push('Please enter a valid email address.'); }
      }

      // Phone is optional, but if provided it must look like a phone number.
      if (phone && phone.value.trim()) {
        var digits = phone.value.replace(/[^0-9]/g, '');
        if (!/^[0-9+\-()\s]+$/.test(phone.value) || digits.length < 7 || digits.length > 15) {
          markInvalid(phone);
          problems.push('Please enter a valid phone number, or leave it blank.');
        }
      }

      if (message) {
        var mv = message.value.trim();
        if (!mv) { markInvalid(message); problems.push('Please enter a message.'); }
        else if (mv.length < 10) { markInvalid(message); problems.push('Your message is a little short — please add a few more details.'); }
      }

      return problems;
    };

    // Clear a field's error state as soon as the user edits it.
    form.addEventListener('input', function (e) {
      var w = wrapOf(e.target);
      if (w && w.classList.contains('field-invalid')) {
        w.classList.remove('field-invalid');
        e.target.removeAttribute('aria-invalid');
      }
    });
    // --------------------------------------------------------------------

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hide(successBox);
      hide(errorBox);

      var problems = validate();
      if (problems.length) {
        if (errorBox) {
          errorBox.textContent = problems[0];
          show(errorBox);
        }
        var firstBad = form.querySelector('.form-field.field-invalid [name], .form-field.field-invalid input, .form-field.field-invalid textarea');
        if (firstBad && typeof firstBad.focus === 'function') firstBad.focus();
        return;
      }

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
