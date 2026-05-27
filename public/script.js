/* ─────────────────────────────────────────────────────────────────────────────
 *  script.js — site-wide enhancements
 *
 *  Contents:
 *    1. View counter            (About page only)
 *    2. Contact form            (Contact page only)
 *    3. Newsletter              (Contact page only)
 *    4. Back-link arrow wrap    (so CSS can style arrows distinctly)
 *
 *  Notes on safety:
 *    • All DOM writes use textContent — never innerHTML.
 *    • Listeners attach via addEventListener only.
 *  ────────────────────────────────────────────────────────────────────────── */

(() => {
  'use strict';

  /* =========================================================================
   * 1. VIEW COUNTER
   * ===================================================================== */
  const viewCountEl = document.getElementById('view-count');
  if (viewCountEl) {
    fetch('/api/views', { method: 'POST' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('view fetch failed'))))
      .then((data) => {
        const n = Number(data && data.views);
        if (Number.isFinite(n)) {
          viewCountEl.textContent = `Total site views: ${n.toLocaleString()}`;
        } else {
          viewCountEl.style.display = 'none';
        }
      })
      .catch(() => {
        viewCountEl.style.display = 'none';
      });
  }

  /* =========================================================================
   * 2. CONTACT FORM
   * ===================================================================== */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('form-status');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const fd = new FormData(contactForm);
      const body = {
        name:    String(fd.get('name')    || '').slice(0, 100),
        email:   String(fd.get('email')   || '').slice(0, 254),
        message: String(fd.get('message') || '').slice(0, 5000),
      };

      if (!body.name || !body.email || !body.message) {
        if (status) status.textContent = 'Please fill in all fields.';
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (status) status.textContent = 'Sending…';

      try {
        const res = await fetch('/api/contact', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(body),
        });
        if (res.ok) {
          if (status) status.textContent = 'Message sent! Thanks.';
          contactForm.reset();
        } else {
          let msg = 'Something went wrong. Try again.';
          try {
            const data = await res.json();
            if (data && typeof data.error === 'string') msg = data.error;
          } catch { /* keep default */ }
          if (status) status.textContent = msg;
        }
      } catch {
        if (status) status.textContent = 'Network error. Try again.';
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* =========================================================================
   * 3. NEWSLETTER
   * ===================================================================== */
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('newsletter-status');
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      const email = String(new FormData(newsletterForm).get('email') || '').slice(0, 254);

      if (submitBtn) submitBtn.disabled = true;
      if (status) status.textContent = 'Subscribing…';

      try {
        const res = await fetch('/api/newsletter', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email }),
        });
        if (res.ok) {
          if (status) status.textContent = "Subscribed! You'll hear from me when something is worth sharing.";
          newsletterForm.reset();
        } else {
          let msg = 'Something went wrong. Try again.';
          try {
            const data = await res.json();
            if (data && typeof data.error === 'string') msg = data.error;
          } catch { /* keep default */ }
          if (status) status.textContent = msg;
        }
      } catch {
        if (status) status.textContent = 'Network error. Try again.';
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* =========================================================================
   * 4. BACK-LINK ARROW WRAP
   * =====================================================================
   *  Each subpage has a back-link like `← Back` or `← Writing`. To give
   *  the arrow a slightly heavier visual weight in CSS without bolding
   *  the entire label, we wrap the leading arrow character in its own
   *  <span class="arrow">. CSS then targets that span only.
   * ===================================================================== */
  function wrapBackLinkArrows() {
    document.querySelectorAll('a.back-link').forEach((a) => {
      if (a.querySelector('.arrow')) return;       // already wrapped
      const text = a.textContent;
      const m = text.match(/^(\s*[←↑→↓])(.*)$/);
      if (!m) return;
      a.textContent = '';                          // safe; no untrusted HTML
      const span = document.createElement('span');
      span.className = 'arrow';
      span.textContent = m[1].trim();
      a.appendChild(span);
      a.appendChild(document.createTextNode(m[2])); // preserves spacing
    });
  }
  if (document.readyState !== 'loading') {
    wrapBackLinkArrows();
  } else {
    document.addEventListener('DOMContentLoaded', wrapBackLinkArrows);
  }

  /* =========================================================================
   * 5. LANGUAGE SWITCHER
   * =====================================================================
   *  Fixed dropdown in the bottom-right of every page.
   *
   *  Behaviour by language:
   *    • English        — page is shown in its source form.
   *    • Google-MT set  — German, Spanish, Turkish, Mandarin (Simplified),
   *                       Cantonese (Traditional Chinese fallback — Google
   *                       does not distinguish spoken Cantonese), Esperanto.
   *                       The Google Translate Element widget is loaded and
   *                       the `googtrans` cookie is set so the translation
   *                       persists across page navigation.
   *    • Notice set     — Interlingua, Ido, Novial, Interslavic. No machine
   *                       translation exists for these; selecting one shows
   *                       a small notice. Pages can be hand-translated and
   *                       placed at `/<lang>/<page>` later; if a hand-
   *                       translation file is present the script will
   *                       redirect there instead of showing the notice.
   *
   *  Persistence:
   *    The choice is stored in localStorage under `siteLang` so the same
   *    language is applied on every page the visitor opens afterwards.
   *
   *  Limitation:
   *    There is no JavaScript API to invoke a browser's built-in "Translate
   *    this page" feature. The Google Translate widget is the closest in-page
   *    equivalent that can be controlled from a dropdown without leaving
   *    the site.
   * ===================================================================== */

  const LANG_OPTIONS = [
    { code: 'en',    label: 'English',          mode: 'native' },
    { code: 'de',    label: 'Deutsch',          mode: 'google' },
    { code: 'es',    label: 'Español',          mode: 'google' },
    { code: 'tr',    label: 'Türkçe',           mode: 'google' },
    { code: 'zh-CN', label: '普通话',           mode: 'google' },
    { code: 'zh-TW', label: '粵語 (繁體)',       mode: 'google' },
    { code: 'eo',    label: 'Esperanto',        mode: 'google' },
    { code: 'ia',    label: 'Interlingua',      mode: 'static' },
    { code: 'io',    label: 'Ido',              mode: 'static' },
    { code: 'nov',   label: 'Novial',           mode: 'static' },
    { code: 'isv',   label: 'Medžuslovjansky',  mode: 'static' },
  ];

  const STATIC_LANGS = LANG_OPTIONS.filter((l) => l.mode === 'static').map((l) => l.code);

  /**
   * Given the current URL, return the canonical English path with leading slash.
   * If we are currently inside a /<conlang>/ folder, strip that prefix.
   */
  function getEnglishPath() {
    let path = location.pathname || '/';
    const re = new RegExp('^/(' + STATIC_LANGS.join('|') + ')(/|$)');
    const m = path.match(re);
    if (m) {
      path = path.slice(m[0].length - (m[2] === '/' ? 1 : 0));
    }
    if (path === '' || path === '/') return '/index.html';
    if (path.endsWith('/')) return path + 'index.html';
    return path;
  }

  /**
   * Build the URL of the hand-translated copy of the current page in `lang`.
   */
  function getStaticPath(lang) {
    const eng = getEnglishPath();
    return '/' + lang + eng;
  }

  /**
   * Test whether a translated copy of the current page exists.
   * Resolves to true on HTTP 200, false otherwise (including network failure).
   */
  function staticTranslationExists(lang) {
    const url = getStaticPath(lang);
    return fetch(url, { method: 'HEAD', cache: 'no-store' })
      .then((r) => r.ok)
      .catch(() => false);
  }

  function setGoogTransCookie(target) {
    const host = location.hostname || '';
    const variants = ['', '; domain=' + host, '; domain=.' + host];
    // Wipe any prior googtrans cookie across the common scopes.
    variants.forEach((v) => {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/' + v;
    });
    if (target && target !== 'en') {
      variants.forEach((v) => {
        document.cookie = 'googtrans=/en/' + target + '; path=/' + v;
      });
    }
  }

  function injectGoogleTranslateWidget() {
    if (document.getElementById('google_translate_element')) return;
    const host = document.createElement('div');
    host.id = 'google_translate_element';
    document.body.appendChild(host);

    window.googleTranslateElementInit = function () {
      // eslint-disable-next-line no-new, no-undef
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'de,es,tr,zh-CN,zh-TW,eo',
        autoDisplay: false,
      }, 'google_translate_element');
    };
    const s = document.createElement('script');
    s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(s);
  }

  function showLangNotice(label) {
    document.querySelectorAll('.lang-notice').forEach((n) => n.remove());

    const notice = document.createElement('div');
    notice.className = 'lang-notice';

    const close = document.createElement('button');
    close.setAttribute('aria-label', 'dismiss');
    close.textContent = '×';
    close.addEventListener('click', () => notice.remove());
    notice.appendChild(close);

    const strong = document.createElement('strong');
    strong.textContent = label;
    notice.appendChild(strong);
    notice.appendChild(document.createTextNode(
      " is a constructed language with no machine-translation engine available. " +
      "A hand-translated version of this page isn't ready yet — sorry!"
    ));

    document.body.appendChild(notice);
  }

  function initLangSwitcher() {
    // TEMPORARILY DISABLED — widget has a bug; CSS also hides .lang-switcher.
    // To re-enable: remove this return statement and the display:none in style.css.
    return;
    if (document.querySelector('.lang-switcher')) return; // eslint-disable-line no-unreachable

    let stored = 'en';
    try { stored = localStorage.getItem('siteLang') || 'en'; } catch (e) { /* ignore */ }
    const currentLang = LANG_OPTIONS.find((l) => l.code === stored) || LANG_OPTIONS[0];

    // Build the dropdown.
    const wrap = document.createElement('div');
    wrap.className = 'lang-switcher';

    const select = document.createElement('select');
    select.setAttribute('aria-label', 'Site language');
    LANG_OPTIONS.forEach((l) => {
      const opt = document.createElement('option');
      opt.value = l.code;
      opt.textContent = l.label;
      select.appendChild(opt);
    });
    select.value = currentLang.code;

    select.addEventListener('change', () => {
      const code = select.value;
      const lang = LANG_OPTIONS.find((l) => l.code === code);
      if (!lang) return;

      try { localStorage.setItem('siteLang', code); } catch (e) { /* ignore */ }

      if (lang.mode === 'static') {
        // Try to find a hand-translated copy of this page; if it exists,
        // navigate there. Otherwise leave the user where they are and show
        // a small notice acknowledging the translation isn't ready.
        staticTranslationExists(lang.code).then((exists) => {
          if (exists) {
            location.href = getStaticPath(lang.code);
          } else {
            showLangNotice(lang.label);
          }
        });
        return;
      }

      // Native or google-MT both go through cookie + reload.
      setGoogTransCookie(lang.code === 'en' ? null : lang.code);

      // If the user was sitting on a /<conlang>/ page and switched to English
      // or a Google-MT language, send them to the canonical English version
      // so the cookie/widget has the right source markup to work on.
      const currentPath = location.pathname || '';
      const inConlangFolder = new RegExp('^/(' + STATIC_LANGS.join('|') + ')(/|$)').test(currentPath);
      if (inConlangFolder) {
        location.href = getEnglishPath();
      } else {
        location.reload();
      }
    });

    wrap.appendChild(select);
    document.body.appendChild(wrap);

    // Inject Google's widget only when an active translation actually needs it,
    // so default English visits incur zero third-party load cost.
    if (currentLang.mode === 'google' && currentLang.code !== 'en') {
      injectGoogleTranslateWidget();
    }

    // Sticky-language behaviour for the conlangs: if the visitor selected a
    // static-translation language earlier and lands on a page where they are
    // not currently in the matching /<lang>/ folder, silently redirect to the
    // translated copy if one exists. No notice fires here — page-load redirect
    // should feel invisible; the notice is reserved for explicit dropdown clicks.
    if (currentLang.mode === 'static') {
      const currentPath = location.pathname || '';
      const inMatchingFolder = new RegExp('^/' + currentLang.code + '(/|$)').test(currentPath);
      if (!inMatchingFolder) {
        staticTranslationExists(currentLang.code).then((exists) => {
          if (exists) location.replace(getStaticPath(currentLang.code));
        });
      }
    }
  }

  if (document.readyState !== 'loading') {
    initLangSwitcher();
  } else {
    document.addEventListener('DOMContentLoaded', initLangSwitcher);
  }
})();

