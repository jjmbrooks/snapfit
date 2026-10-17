// Motor de audio (WebAudio). Música en bucle sin cortes y efectos de baja latencia, ambos del paquete de
// historia activo (manifest.assets.audio). Sin paquete de audio: efectos sintetizados y sin música.
// - Nada suena antes de la primera interacción (política de autoplay): unlockAudio() en el primer toque.
// - Carga diferida: cada archivo se pide la primera vez que suena; el SW lo guarda para uso sin red.
// - Preferencias en el dispositivo (localStorage 'snapfit.audio'); sin analítica.
// - iOS/Safari: navigator.audioSession.type = 'ambient' → respeta el interruptor de silencio y no corta
//   la música de otras apps.
import { currentStory, onStoryChange } from '../story/index.js';
import { DEFAULT_PREFS, normalizePrefs, resolveAudio, channelGain } from './plan.js';

const KEY = 'snapfit.audio';
let prefs = loadPrefs();
let ctx = null;
let musicBus = null;
let sfxBus = null;
let unlocked = false;
let wanted = null; // clave de música pedida por la pantalla actual
let override = null; // música temporal por encima de la pantalla (celebración)
let now = { url: null, src: null, gain: null };
const buffers = new Map(); // url → Promise<AudioBuffer>

function loadPrefs() {
  try { return normalizePrefs(JSON.parse(localStorage.getItem(KEY) || 'null') || DEFAULT_PREFS); } catch { return normalizePrefs(DEFAULT_PREFS); }
}
export const getAudioPrefs = () => ({ ...prefs });
export function setAudioPrefs(patch) {
  prefs = normalizePrefs({ ...prefs, ...patch });
  try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch { /* modo privado */ }
  applyGains();
  syncMusic(); // enciende/apaga la música si cambió
}

let oggOk = null;
const canOgg = () => {
  if (oggOk == null) { try { oggOk = !!new Audio().canPlayType('audio/ogg; codecs="vorbis"'); } catch { oggOk = false; } }
  return oggOk;
};
const base = () => import.meta.env?.BASE_URL || '/';
const urlFor = (kind, name) => resolveAudio(currentStory().assets, kind, name, { canOgg: canOgg(), base: base() });

function ensureCtx() {
  if (ctx) return ctx;
  const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
  if (!AC) return null;
  try { if (navigator.audioSession) navigator.audioSession.type = 'ambient'; } catch { /* no soportado */ }
  ctx = new AC();
  musicBus = ctx.createGain();
  sfxBus = ctx.createGain();
  musicBus.connect(ctx.destination);
  sfxBus.connect(ctx.destination);
  applyGains();
  return ctx;
}
function applyGains() {
  if (!ctx) return;
  const t = ctx.currentTime;
  musicBus.gain.setTargetAtTime(channelGain(prefs, 'music'), t, 0.05);
  sfxBus.gain.setTargetAtTime(channelGain(prefs, 'sfx'), t, 0.02);
}

/** Primer toque/tecla del usuario: crea el contexto y arranca la música pendiente. */
export function unlockAudio() {
  if (!ensureCtx()) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  if (!unlocked) { unlocked = true; syncMusic(); }
}

function getBuffer(url) {
  if (!buffers.has(url)) {
    const p = fetch(url)
      .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.arrayBuffer(); })
      .then((b) => new Promise((res, rej) => ctx.decodeAudioData(b, res, rej)));
    p.catch(() => buffers.delete(url));
    buffers.set(url, p);
  }
  return buffers.get(url);
}

/** Cambia la música de fondo (null = silencio) con fundido. */
export function setMusic(key) {
  wanted = key || null;
  syncMusic();
}
/** Música temporal (p. ej. 'celebracion' durante la recompensa); null vuelve a la de la pantalla. */
export function setMusicOverride(key) {
  override = key || null;
  syncMusic();
}
function syncMusic() {
  if (!unlocked || !ctx) return;
  const key = override || wanted;
  const url = key && channelGain(prefs, 'music') > 0 ? urlFor('music', key) : null;
  if (url === now.url) return;
  const old = now;
  if (old.src) {
    const t = ctx.currentTime;
    old.gain.gain.cancelScheduledValues(t);
    old.gain.gain.setValueAtTime(old.gain.gain.value, t);
    old.gain.gain.linearRampToValueAtTime(0, t + 0.8);
    try { old.src.stop(t + 0.85); } catch { /* ya parado */ }
  }
  // Libera la memoria de pistas que ya no suenan (se vuelven a pedir del caché del SW si hace falta).
  for (const u of buffers.keys()) if (u !== url && u !== old.url && /musica-/.test(u)) buffers.delete(u);
  now = { url, src: null, gain: null };
  if (!url) return;
  getBuffer(url).then((buf) => {
    if (now.url !== url) return;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const g = ctx.createGain();
    g.gain.value = 0;
    src.connect(g).connect(musicBus);
    src.start();
    g.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.2);
    now.src = src;
    now.gain = g;
  }).catch(() => { if (now.url === url) now = { url: null, src: null, gain: null }; });
}

/** Efecto de sonido por nombre (ver plan.js SFX_KEYS). */
export function playSfx(name) {
  if (!unlocked || !ctx || channelGain(prefs, 'sfx') === 0) return;
  const url = urlFor('sfx', name);
  if (!url) return synth(name);
  getBuffer(url).then((buf) => {
    const s = ctx.createBufferSource();
    s.buffer = buf;
    s.connect(sfxBus);
    s.start();
  }).catch(() => synth(name));
}

// Respaldo para paquetes sin audio: chiptune de onda cuadrada (el sonido original de SnapFit).
const SEQ = {
  listo: [[660, 0.07], [880, 0.07], [1320, 0.12]],
  otro: [[440, 0.05], [330, 0.07]],
  logro: [[523, 0.08], [659, 0.08], [784, 0.08], [1047, 0.2]],
  meta: [[523, 0.08], [784, 0.08], [1047, 0.16]],
  nivel: [[392, 0.08], [523, 0.08], [659, 0.08], [784, 0.08], [1047, 0.08], [1319, 0.25]],
  flip: [[880, 0.03]],
  tap: [[1200, 0.02]],
};
function synth(name) {
  let t = ctx.currentTime;
  for (const [f, d] of SEQ[name] || []) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'square';
    o.frequency.value = f;
    g.gain.setValueAtTime(0.06, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + d);
    o.connect(g).connect(sfxBus);
    o.start(t);
    o.stop(t + d);
    t += d;
  }
}

if (typeof document !== 'undefined') {
  // En segundo plano no suena nada (y no gasta batería); al volver, sigue donde iba.
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend().catch(() => {});
    else if (unlocked) ctx.resume().catch(() => {});
  });
  // Otra historia → otro paquete de audio.
  onStoryChange(() => { buffers.clear(); if (ctx && now.src) { try { now.src.stop(); } catch { /* */ } } now = { url: null, src: null, gain: null }; syncMusic(); });
}
