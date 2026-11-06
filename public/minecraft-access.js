/* minecraft-access.js — Minecraft page: access form, server status, copy-IP.
 * Moved out of an inline <script> in minecraft-server.html: the site CSP
 * (script-src 'self') blocks inline scripts, so the page never ran it. */
(function () {
  var form = document.getElementById('mc-access-form');
  var submit = document.getElementById('mc-submit-btn');
  var message = document.getElementById('mc-access-message');
  var result = document.getElementById('mc-access-result');
  var btn = document.getElementById('mc-copy-btn');
  var input = document.getElementById('mc-ip');
  var status = document.getElementById('mc-status');
  var captchaToken = '';
  var captchaReady = false;

  function setMessage(text, kind) {
    message.textContent = text;
    message.className = 'mc-access-message' + (kind ? ' ' + kind : '');
  }

  function setStatus(online) {
    status.innerHTML = '<span class="mc-status-dot"></span>' + (online ? 'Online' : 'Offline / maintenance');
    status.style.color = online ? '' : '#d4b24a';
    status.style.borderColor = online ? '' : '#4a4325';
    var dot = status.querySelector('.mc-status-dot');
    if (!online && dot) {
      dot.style.background = '#d4b24a';
      dot.style.boxShadow = '0 0 8px rgba(212, 178, 74, 0.9)';
    }
  }

  function loadStatus() {
    fetch('/api/minecraft-status').then(function (response) {
      return response.ok ? response.json() : null;
    }).then(function (data) {
      if (data && data.known) setStatus(Boolean(data.online));
      else status.textContent = 'Status unavailable';
    }).catch(function () {
      status.textContent = 'Status unavailable';
    });
  }

  function renderTurnstile(siteKey) {
    var host = document.getElementById('mc-turnstile');
    var tries = 0;
    function render() {
      if (window.turnstile && window.turnstile.render) {
        host.textContent = '';
        window.turnstile.render(host, {
          sitekey: siteKey,
          action: 'minecraft-access',
          callback: function (token) {
            captchaToken = token;
            captchaReady = true;
            submit.disabled = false;
          },
          'expired-callback': function () {
            captchaToken = '';
            captchaReady = false;
            submit.disabled = true;
          },
          'error-callback': function () {
            captchaToken = '';
            captchaReady = false;
            submit.disabled = true;
            setMessage('Human verification could not load. Please refresh and try again.', 'error');
          }
        });
        return;
      }
      tries++;
      if (tries < 50) setTimeout(render, 100);
      else host.textContent = 'Human verification could not load. Please refresh and try again.';
    }
    render();
  }

  fetch('/api/minecraft-access/config').then(function (response) {
    return response.ok ? response.json() : null;
  }).then(function (config) {
    if (!config || !config.enabled || !config.turnstileSiteKey) {
      document.getElementById('mc-turnstile').textContent = 'Server access requests are temporarily unavailable.';
      setMessage('Server access requests are temporarily unavailable. Please try again later.', 'error');
      return;
    }
    renderTurnstile(config.turnstileSiteKey);
  }).catch(function () {
    document.getElementById('mc-turnstile').textContent = 'Server access requests are temporarily unavailable.';
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!captchaReady || !captchaToken) {
      setMessage('Please complete the human verification first.', 'error');
      return;
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submit.disabled = true;
    setMessage('Adding your username to the whitelist…', '');
    fetch('/api/minecraft-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: document.getElementById('mc-email').value,
        minecraftUsername: document.getElementById('mc-username').value,
        turnstileToken: captchaToken,
        privacyAccepted: document.getElementById('mc-privacy').checked,
        website: document.getElementById('mc-website').value
      })
    }).then(function (response) {
      return response.json().then(function (data) {
        return { ok: response.ok, data: data };
      });
    }).then(function (outcome) {
      if (!outcome.ok || !outcome.data.serverAddress) {
        setMessage(outcome.data.error || 'We could not process that request. Please try again.', 'error');
        if (window.turnstile && window.turnstile.reset) window.turnstile.reset();
        captchaToken = '';
        captchaReady = false;
        return;
      }
      input.value = outcome.data.serverAddress;
      result.classList.add('visible');
      setMessage(outcome.data.message || 'You are whitelisted. Your server address is ready below.', 'success');
      form.querySelectorAll('input, button').forEach(function (element) { element.disabled = true; });
    }).catch(function () {
      setMessage('Network error. Please try again.', 'error');
      if (window.turnstile && window.turnstile.reset) window.turnstile.reset();
      captchaToken = '';
      captchaReady = false;
    }).finally(function () {
      if (!result.classList.contains('visible') && captchaReady) submit.disabled = false;
    });
  });

  function flash(label) {
    var original = 'Copy IP';
    btn.textContent = label;
    btn.classList.add('copied');
    setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 1600);
  }

  function copyIp() {
    var ip = input.value;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ip).then(function () {
        flash('Copied! ✔');
      }, fallbackCopy);
    } else {
      fallbackCopy();
    }
  }

  function fallbackCopy() {
    input.focus();
    input.select();
    input.setSelectionRange(0, input.value.length);
    try {
      document.execCommand('copy');
      flash('Copied! ✔');
    } catch (e) {
      flash('Select & copy manually');
    }
  }

  btn.addEventListener('click', copyIp);
  input.addEventListener('click', function () {
    input.select();
    input.setSelectionRange(0, input.value.length);
  });

  loadStatus();
})();
