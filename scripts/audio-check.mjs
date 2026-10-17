// Prueba de humo del audio en Chrome headless (requiere `npm run build && npx vite preview`): nada se pide antes del
// primer toque; tras tocar suena la música de intro y el efecto «niebla»; sin OGG se usan los .mp3 (Safari).
// Uso: node scripts/audio-check.mjs  → una línea JSON por caso (peticiones, buffers decodificados, errores).
import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--autoplay-policy=user-gesture-required'] });
for (const noOgg of [false, true]) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  if (noOgg) await ctx.addInitScript(() => { HTMLMediaElement.prototype.canPlayType = () => ''; });
  await ctx.addInitScript(() => {
    const AC = window.AudioContext; window.__dec = []; window.__starts = 0;
    const od = AC.prototype.decodeAudioData;
    AC.prototype.decodeAudioData = function (b, ok, err) { return od.call(this, b, (buf) => { window.__dec.push(buf.duration.toFixed(2)); ok && ok(buf); }, err); };
    const os = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function (...a) { window.__starts++; return os.apply(this, a); };
  });
  const page = await ctx.newPage();
  const reqs = []; const errs = [];
  page.on('request', (r) => { if (r.url().includes('/audio/')) reqs.push(r.url().split('/').pop()); });
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto('http://localhost:4173/snapfit/', { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-onb=to-signin]');
  const before = [...reqs];
  await page.mouse.click(10, 10); // primer toque
  await page.waitForTimeout(1500);
  await page.click('[data-onb=to-signin]');
  await page.waitForTimeout(1500);
  const st = await page.evaluate(() => ({ dec: window.__dec, starts: window.__starts }));
  console.log(JSON.stringify({ noOgg, beforeTap: before, reqs, ...st, errs }));
  await ctx.close();
}
await browser.close();
