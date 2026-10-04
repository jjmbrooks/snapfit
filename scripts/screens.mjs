// Capturas móviles 390×844 con Chrome headless (playwright-core). Uso: node scripts/screens.mjs <url> <outDir>
// El login con Google no se puede automatizar: tras capturar la bienvenida, el script siembra en IndexedDB
// un accountUid ficticio ('fixture-capturas') para simular «ya inició sesión una vez» y continuar el flujo.
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
const shot = async (name, wait = 500) => { await page.waitForTimeout(wait); await page.screenshot({ path: `${out}/${name}-390x844.png` }); console.log('📸', name); };

// Comprueba que la barra inferior no tape ningún botón visible del contenido.
async function checkNav(label) {
  const r = await page.evaluate(() => {
    const nav = document.querySelector('nav.bottomnav');
    const main = document.querySelector('main');
    const doc = document.documentElement;
    const overflowX = doc.scrollWidth > doc.clientWidth + 1;
    if (!nav || getComputedStyle(nav).display === 'none') return { overflowX, covered: [] };
    const top = nav.getBoundingClientRect().top;
    const mainBottom = main.getBoundingClientRect().bottom;
    const covered = [...main.querySelectorAll('button, a.btn')].filter((b) => {
      const br = b.getBoundingClientRect();
      return br.height && br.bottom > top + 1 && br.top < top && br.bottom <= mainBottom + 1;
    }).map((b) => b.textContent.trim());
    return { overflowX, covered, mainBottom, top };
  });
  if (r.overflowX || r.covered.length || r.mainBottom > r.top + 1) errors.push(`${label}: ${JSON.stringify(r)}`);
}

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForSelector('[data-onb=to-signin]');
await shot('01-bienvenida-historia', 2200);
await page.click('[data-onb=to-signin]');
await page.waitForSelector('[data-onb=google]');
await shot('02-login-google');

// Simula «ya inició sesión con Google» (no se puede automatizar el popup).
await page.evaluate(() => new Promise((res, rej) => {
  const r = indexedDB.open('snapfit');
  r.onsuccess = () => {
    const t = r.result.transaction('profile', 'readwrite');
    const s = t.objectStore('profile');
    const g = s.get('me');
    g.onsuccess = () => s.put({ ...(g.result || {}), accountUid: 'fixture-capturas' }, 'me');
    t.oncomplete = () => res();
    t.onerror = () => rej(t.error);
  };
}));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForSelector('#pf #age');
await page.fill('#age', '34');
await page.click('label:has(input[name=sex]) >> nth=0');
await shot('03-perfil-sobre-ti');
await page.click('#pf button[type=submit]');
await page.click('label:has(input[name=fitness]) >> nth=1');
await shot('04-perfil-condicion');
await page.click('#pf button[type=submit]');
for (const n of await page.$$eval('#pf input[type=radio]', (xs) => [...new Set(xs.map((x) => x.name))])) await page.click(`label:has(input[name=${n}]) >> nth=1`);
await shot('05-prueba-rapida');
await page.click('#pf button[type=submit]');
await page.waitForSelector('.lvl-grid');
await shot('06-mazo-asignado');
await page.click('#pf button[type=submit]');
await page.waitForSelector('#tf');
await page.uncheck('input[name=an]', { force: true }); // no enviar analytics desde CI/capturas
await page.check('input[name=ok]', { force: true });
await shot('07-terminos-salud');
await page.click('#tf button[type=submit]');
await page.waitForSelector('[data-act=done]');
await shot('08-carta-frente', 1200);
await checkNav('carta');
await page.click('.tcard');
await shot('09-carta-reverso', 1200);
await page.click('.tcard');
await page.waitForTimeout(700);
await page.click('[data-act=skip]');
await shot('10-otro-siguiente-carta', 1000);
await page.click('[data-act=done]');
await page.waitForSelector('.seq-congrats [data-next]');
await shot('11-felicitacion', 900);
await page.click('.seq-congrats [data-effort] >> nth=1'); // elegir esfuerzo también avanza
await page.waitForSelector('.seq-progress [data-next]');
await shot('12-progreso', 1400);
await page.click('.seq-progress [data-next]');
if (await page.$('.seq-badges [data-next]')) {
  await shot('13-logros-nuevos', 900);
  await page.click('.seq-badges [data-next]');
}
await page.waitForSelector('[data-act=done]:not([disabled])', { timeout: 5000 }); // la siguiente carta debe quedar jugable
await shot('14-carta-siguiente', 1000);
await checkNav('carta-siguiente');
for (const [hash, name] of [['#/progreso', '15-progreso-tab'], ['#/logros', '16-logros-tab'], ['#/menu', '17-menu']]) {
  await page.evaluate((h) => (location.hash = h), hash);
  await shot(name, 800);
  await checkNav(name);
}
await page.evaluate(() => document.querySelector('main').scrollTo(0, 1e6));
await shot('18-menu-final-scroll', 400);
await checkNav('menu-scroll');

await browser.close();
const fatal = errors.filter((e) => !/firebase|googleapis|identitytoolkit|ERR_|net::/i.test(e));
if (errors.length) console.log('Avisos:', errors);
if (fatal.length) { console.error('ERRORES:', fatal); process.exit(1); }
console.log('OK');
