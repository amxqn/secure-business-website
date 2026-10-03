// Contact form validation.
// Security notes:
// - Messages are written with textContent, never innerHTML, so user input can't inject HTML or scripts.
// - Server-side validation is still needed in a real site. Client-side checks only help honest users.

(function () {
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var message = document.getElementById('message');
  var count = document.getElementById('count');

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(id, text) {
    document.getElementById(id + '-error').textContent = text;
    document.getElementById(id).setAttribute('aria-invalid', text ? 'true' : 'false');
  }

  function validate() {
    var name = form.elements['name'].value.trim();
    var email = form.elements['email'].value.trim();
    var text = form.elements['message'].value.trim();
    var ok = true;

    if (name.length < 2 || name.length > 60) {
      setError('name', 'Enter your name (2 to 60 characters).');
      ok = false;
    } else {
      setError('name', '');
    }

    if (!emailPattern.test(email) || email.length > 100) {
      setError('email', 'Enter a valid email address, like name@example.com.');
      ok = false;
    } else {
      setError('email', '');
    }

    if (text.length < 10 || text.length > 1000) {
      setError('message', 'Write a message between 10 and 1000 characters.');
      ok = false;
    } else {
      setError('message', '');
    }

    return ok;
  }

  message.addEventListener('input', function () {
    count.textContent = message.value.length;
  });

  form.addEventListener('submit', function (event) {
    status.textContent = '';

    // Honeypot: real people never see this field, so a filled value means a bot.
    if (form.elements['_gotcha'].value !== '') {
      event.preventDefault();
      return;
    }

    if (!validate()) {
      event.preventDefault();
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Until a real Formspree ID is added, don't send anything.
    if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
      event.preventDefault();
      status.textContent = 'Demo mode: the form is valid, but it is not connected to an inbox yet.';
    }
  });
})();
