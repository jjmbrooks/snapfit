// Capturas móviles 390×844 con Chrome headless (playwright-core). Uso: node scripts/screens.mjs <url> <outDir>
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const url = process.argv[2] || 'http://localhost:4173/snapfit/';
const out = process.argv[3] || 'docs/evidence';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-MX', colorScheme: 'dark' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForSelector('.onb form');
await page.screenshot({ path: `${out}/01-onboarding-390x844.png` });
await page.check('input[name=age]');
await page.check('input[name=place][value=casa]');
await page.uncheck('input[name=an]'); // no enviar analytics desde CI/capturas
await page.click('.onb button[type=submit]');
await page.waitForSelector('[data-act=done]');
await page.waitForTimeout(700);
await page.screenshot({ path: `${out}/02-carta-390x844.png` });
await page.click('[data-act=done]');
await page.waitForSelector('.overlay [data-next]');
await page.waitForTimeout(600);
await page.screenshot({ path: `${out}/03-recompensa-390x844.png` });
await page.click('.overlay [data-effort=bien]');
await page.click('[data-act=done]');
await page.waitForSelector('.overlay [data-next]');
await page.click('.overlay [data-next]');
await page.goto(url + '#/progreso');
await page.waitForSelector('.lvl-row');
await page.screenshot({ path: `${out}/04-progreso-390x844.png` });
await page.goto(url + '#/menu');
await page.waitForSelector('[data-theme-pick]');
await page.click('[data-theme-pick=selva]');
await page.waitForTimeout(200);
await page.screenshot({ path: `${out}/05-menu-selva-390x844.png` });
await page.goto(url + '#/logros');
await page.waitForSelector('.badge');
await page.screenshot({ path: `${out}/06-logros-390x844.png` });

// Offline: tras la primera carga el SW debe servir la app.
const sw = await page.evaluate(async () => { const r = await navigator.serviceWorker.ready; return !!r.active; });
await page.reload({ waitUntil: 'networkidle' });
await ctx.setOffline(true);
await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('[data-act=done]', { timeout: 8000 });
const offlineOk = await page.isVisible('[data-act=done]');
const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
console.log(JSON.stringify({ sw, offlineOk, overflow, errors }, null, 2));
await browser.close();
