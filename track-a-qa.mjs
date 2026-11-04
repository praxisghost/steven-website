/* track-a-qa.mjs — browser check: every page loads, shows "Other" in the nav,
 * /other renders, no console errors / page errors / failed same-origin requests. */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('/Users/proteus/Dev5/world-history-timeline/node_modules/puppeteer-core');

const BASE = 'http://localhost:3111';
const PATHS = ['/', '/about', '/projects', '/contact', '/other', '/minecraft-server',
  '/projects/501c-coop', '/projects/ai', '/projects/aquaponics', '/projects/circuits',
  '/projects/visual-literary-arts'];

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

let failures = 0;
for (const p of PATHS) {
  const consoleErrors = [];
  const pageErrors = [];
  const failedReqs = [];
  const onConsole = (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); };
  const onPageError = (e) => pageErrors.push(String(e));
  const onReqFailed = (r) => {
    if (!r || typeof r.url !== 'function') return;
    const u = r.url();
    if (u.startsWith(BASE)) failedReqs.push(`${r.method()} ${u}`);
  };
  page.on('console', onConsole); page.on('pageerror', onPageError); page.on('requestfailed', onReqFailed);

  const resp = await page.goto(BASE + p, { waitUntil: 'networkidle2', timeout: 20000 });
  const status = resp ? resp.status() : '??';
  const navOk = await page.evaluate(() => {
    const links = document.querySelectorAll('nav a[href="/other"]');
    return { count: links.length, label: links[0] ? links[0].textContent.trim() : null };
  });
  const extra = p === '/other'
    ? await page.evaluate(() => ({
        title: document.querySelector('h1')?.textContent,
        comingSoon: document.querySelector('[data-site-link="timeline"]')?.textContent.trim(),
        guitarSoon: document.querySelector('[data-site-link="guitarSite"]')?.textContent.trim(),
        footerOther: !!document.querySelector('.site-footer a[href="/other"]'),
      }))
    : null;

  const bad = status !== 200 || navOk.count < 1 || navOk.label !== 'Other' ||
    consoleErrors.length || pageErrors.length || failedReqs.length;
  if (bad) failures++;
  console.log(`${bad ? 'FAIL' : 'PASS'} ${p} status=${status} navOther=${navOk.count}x"${navOk.label}"` +
    (consoleErrors.length ? ` consoleErrors=${JSON.stringify(consoleErrors)}` : '') +
    (pageErrors.length ? ` pageErrors=${JSON.stringify(pageErrors)}` : '') +
    (failedReqs.length ? ` failedReqs=${JSON.stringify(failedReqs)}` : '') +
    (extra ? ` ${JSON.stringify(extra)}` : ''));

  page.off('console', onConsole); page.off('pageerror', onPageError); page.off('requestfailed', onReqFailed);
}
await browser.close();
console.log(failures === 0 ? 'QA PASS (all pages)' : `QA FAIL (${failures} page(s))`);
process.exit(failures === 0 ? 0 : 1);
