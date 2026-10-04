// Capturas 390×844 de la MISMA carta en cada paquete de historia (prueba de que cambiar historia
// solo cambia textos/arte, no la mecánica). Uso: node scripts/story-shots.mjs <url> <outDir> [cardId] [ids…]
import { chromium } from 'playwright-core';
import { mkdirSync, readdirSync, statSync } from 'node:fs';

const url = (process.argv[2] || 'http://localhost:4173/snapfit/').replace(/\/?$/, '/');
const out = process.argv[3] || 'docs/evidence/story-packs';
const cardId = process.argv[4] || 'sentadilla-silla-l1';
const ids = process.argv.slice(5).length ? process.argv.slice(5) : readdirSync('content/stories').filter((d) => statSync(`content/stories/${d}`).isDirectory());
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const errors = [];

for (const id of ids) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-MX', colorScheme: 'dark' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`${id}: ${e}`));
  const shot = async (name, wait = 600) => { await page.waitForTimeout(wait); await page.screenshot({ path: `${out}/${id}-${name}-390x844.png` }); console.log('📸', id, name); };
  const q = `?story=${id}&historias=1`;
  await page.goto(url + q, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-onb=to-signin]');
  await shot('1-bienvenida', 2400);
  // Simula «ya inició sesión» (el popup de Google no se automatiza) y completa el perfil.
  await page.evaluate(() => new Promise((res) => {
    const r = indexedDB.open('snapfit');
    r.onsuccess = () => { const t = r.result.transaction('profile', 'readwrite'); const s = t.objectStore('profile'); const g = s.get('me'); g.onsuccess = () => s.put({ ...(g.result || {}), accountUid: 'fixture-capturas' }, 'me'); t.oncomplete = res; };
  }));
  await page.reload({ waitUntil: 'networkidle' });
  await page.fill('#age', '34');
  await page.click('label:has(input[name=sex]) >> nth=0');
  await page.click('#pf button[type=submit]');
  await page.click('label:has(input[name=fitness]) >> nth=1');
  await page.click('#pf button[type=submit]');
  for (const n of await page.$$eval('#pf input[type=radio]', (xs) => [...new Set(xs.map((x) => x.name))])) await page.click(`label:has(input[name=${n}]) >> nth=1`);
  await page.click('#pf button[type=submit]');
  await page.waitForSelector('.lvl-grid');
  await shot('2-mazo-listo');
  await page.click('#pf button[type=submit]');
  await page.uncheck('input[name=an]', { force: true });
  await page.check('input[name=ok]', { force: true });
  await page.click('#tf button[type=submit]');
  await page.waitForSelector('[data-act=done]:not([disabled])');
  // «Otro» hasta que salga la carta pedida (la mecánica es la misma en cualquier historia).
  for (let i = 0; i < 30 && (await page.getAttribute('.tcard', 'data-card')) !== cardId; i++) {
    await page.click('[data-act=skip]');
    await page.waitForSelector('[data-act=done]:not([disabled])');
    await page.waitForTimeout(450);
  }
  if ((await page.getAttribute('.tcard', 'data-card')) !== cardId) errors.push(`${id}: no apareció ${cardId}`);
  await shot('3-carta-frente', 1200);
  await page.click('.tcard');
  await shot('4-carta-reverso', 1200);
  await page.evaluate(() => (location.hash = '#/menu'));
  await shot('5-menu-historia', 1200);
  await ctx.close();
}
await browser.close();
if (errors.length) { console.error('ERRORES:', errors); process.exit(1); }
console.log('OK');
