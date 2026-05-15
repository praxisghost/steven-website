// ── Page view counter ──────────────────────────────────────────
// Only runs on index.html (where #view-count exists)
const viewCountEl = document.getElementById('view-count');
if (viewCountEl) {
  fetch('/api/views', { method: 'POST' })
    .then(r => r.json())
    .then(data => {
      viewCountEl.textContent = `${data.views} visits`;
    })
    .catch(() => {
      viewCountEl.style.display = 'none'; // fail silently
    });
}

// ── Contact form ───────────────────────────────────────────────
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    const body = {
      name:    form.name.value,
      email:   form.email.value,
      message: form.message.value,
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        status.textContent = 'Message sent! Thanks.';
        form.reset();
      } else {
        status.textContent = 'Something went wrong. Try again.';
      }
    } catch {
      status.textContent = 'Network error. Try again.';
    }
  });
}