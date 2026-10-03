// Analytics perezoso y mínimo (docs/PRIVACY.md).
// Solo eventos de uso agregados: card_done, card_skip, level_up, theme_change.
// Sin datos personales, sin texto libre, sin user properties propias, sin señales de Google ni anuncios.
import { getFirebaseApp } from './app.js';

const ALLOWED = {
  card_done: ['card_level', 'muscle_group'],
  card_skip: ['card_level', 'muscle_group'],
  level_up: ['muscle_group', 'level'],
  theme_change: ['theme'],
};

let state = 'idle'; // idle | loading | ready | off
let mod = null;
let ga = null;
const queue = [];

export async function initAnalytics(enabled) {
  if (!enabled) return setAnalyticsEnabled(false);
  if (state === 'ready' || state === 'loading') return;
  if (typeof navigator !== 'undefined' && !navigator.onLine) return;
  state = 'loading';
  try {
    const app = await getFirebaseApp();
    mod = await import('firebase/analytics');
    if (!(await mod.isSupported())) { state = 'off'; return; }
    ga = mod.initializeAnalytics(app, {
      config: { allow_google_signals: false, allow_ad_personalization_signals: false, send_page_view: false },
    });
    mod.setAnalyticsCollectionEnabled(ga, true);
    state = 'ready';
    while (queue.length) track(...queue.shift());
  } catch (e) {
    console.warn('[analytics]', e?.message);
    state = 'off';
  }
}

export function setAnalyticsEnabled(on) {
  if (!on) {
    queue.length = 0;
    if (ga && mod) mod.setAnalyticsCollectionEnabled(ga, false);
    if (state !== 'ready') state = 'idle';
    return;
  }
  if (ga && mod) mod.setAnalyticsCollectionEnabled(ga, true);
}

/** Registra un evento permitido con parámetros filtrados (lista blanca). */
export function track(name, params = {}) {
  const keys = ALLOWED[name];
  if (!keys) return;
  const safe = {};
  for (const k of keys) if (typeof params[k] === 'string' || typeof params[k] === 'number') safe[k] = params[k];
  if (state === 'ready') mod.logEvent(ga, name, safe);
  else if (state === 'loading' || state === 'idle') { if (queue.length < 50) queue.push([name, safe]); }
}
