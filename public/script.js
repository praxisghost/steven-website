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

// ── Newsletter signup ──────────────────────────────────────────
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('newsletter-status');
    const email  = newsletterForm.email.value;
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        status.textContent = 'Subscribed! You\'ll hear from me when something is worth sharing.';
        newsletterForm.reset();
      } else {
        status.textContent = 'Something went wrong. Try again.';
      }
    } catch {
      status.textContent = 'Network error. Try again.';
    }
  });
}
