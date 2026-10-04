// Capturas 390×844 de la carta arcade (estilo C) en los 4 rangos, frente y reverso, usando la ruta de muestra
// #/muestra/:id/:nivel (solo lectura). Uso: node scripts/card-shots.mjs <url> <outDir> [cardId] [storyId]
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const url = (process.argv[2] || 'http://localhost:4173/snapfit/').replace(/\/?$/, '/');
const out = process.argv[3] || 'docs/evidence/cartas-arcade';
const cardId = process.argv[4] || 'sentadilla-silla-l1';
const story = process.argv[5] || '';
const RANKS = [[1, '1-aprendiz-bronce'], [4, '2-adepto-plata'], [7, '3-magister-oro'], [10, '4-archimago-gema']];
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-MX', colorScheme: 'dark' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
const q = story ? `?story=${story}` : '';
for (const [lvl, name] of RANKS) {
  await page.goto(`${url}${q}#/muestra/${cardId}/${lvl}`, { waitUntil: 'networkidle' });
  await page.reload({ waitUntil: 'networkidle' }); // asegura render limpio por hash
  await page.waitForSelector(`.tcard[data-level="${lvl}"]`);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/${name}-frente-390x844.png` });
  await page.click('.tcard');
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}/${name}-reverso-390x844.png` });
  console.log('📸', name);
}
await browser.close();
if (errors.length) { console.error('ERRORES:', errors); process.exit(1); }
console.log('OK');
