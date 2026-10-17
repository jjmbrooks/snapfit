// Plan de audio (puro, sin DOM): qué música suena en cada pantalla, qué efecto corresponde a cada
// evento y cómo se resuelven las rutas del paquete de historia. Lo usan engine.js y los tests.
// Diseño y justificación temática: docs/AUDIO.md.

export const MUSIC_KEYS = ['intro', 'menu', 'sesion', 'celebracion'];
export const SFX_KEYS = ['flip', 'listo', 'otro', 'logro', 'nivel', 'meta', 'tap', 'intro'];

/** Preferencias guardadas en el dispositivo (localStorage). */
export const DEFAULT_PREFS = Object.freeze({ muted: false, music: true, sfx: true, musicVol: 0.35, sfxVol: 0.7 });
const clamp01 = (v, d) => (Number.isFinite(Number(v)) ? Math.min(1, Math.max(0, Number(v))) : d);
export function normalizePrefs(p) {
  const o = p && typeof p === 'object' ? p : {};
  return {
    muted: o.muted === true,
    music: o.music !== false,
    sfx: o.sfx !== false,
    musicVol: clamp01(o.musicVol, DEFAULT_PREFS.musicVol),
    sfxVol: clamp01(o.sfxVol, DEFAULT_PREFS.sfxVol),
  };
}

/** Música por ruta: onboarding → intro · mazo/muestra → sesión · resto → menú. */
export function musicForRoute(routeName, { onboarding = false } = {}) {
  if (onboarding || routeName === 'profile') return 'intro';
  if (routeName === 'card' || routeName === 'sample') return 'sesion';
  return 'menu';
}

/** Efecto al completar una carta: nivel > meta del día / racha > logro > ¡Listo!. */
export function sfxForDone(before, after, diff) {
  if (diff?.levelChanges?.some((c) => c.to > c.from)) return 'nivel';
  const goal = after?.dailyGoal ?? 3;
  if (before && after && before.todayCount < goal && after.todayCount >= goal) return 'meta';
  if (before && after && after.streak?.current > (before.streak?.current ?? 0) && after.streak.current >= 2) return 'meta';
  if (diff?.newBadges?.length) return 'logro';
  return 'listo';
}

/** ¿El evento merece la música de celebración durante la secuencia de recompensa? */
export const celebrates = (sfxName) => ['nivel', 'meta', 'logro'].includes(sfxName);

/** URL de un audio del paquete (o null). `assets.audio.formats` permite caer a .mp3 si no hay OGG. */
export function resolveAudio(assets, kind, name, { canOgg = true, base = '/' } = {}) {
  const a = assets?.audio;
  const p = a?.[kind]?.[name];
  if (typeof p !== 'string') return null;
  let url = `${base}${p}`;
  if (!canOgg && /\.ogg$/i.test(url) && (a.formats || []).includes('mp3')) url = url.replace(/\.ogg$/i, '.mp3');
  return url;
}

/** Ganancia final 0–1 de un canal según las preferencias. */
export const channelGain = (prefs, channel) => {
  const p = normalizePrefs(prefs);
  if (p.muted || !p[channel]) return 0;
  return channel === 'music' ? p.musicVol : p.sfxVol;
};
