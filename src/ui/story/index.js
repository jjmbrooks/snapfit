// Resolver de historia (capa UI). La historia es un PAQUETE independiente de la mecánica:
// el core y el progreso solo guardan ids estables; aquí se traducen a textos y assets del paquete activo.
// Ver docs/story/STORY-PACKS.md y ADR-011 en docs/02-ARCHITECTURE.md.
import INDEX from '../../../content/stories/index.json';
import { BADGE_IDS } from '../../core/index.js';
import { resolveStory, validatePack, frameFor } from './resolve.js';
import { genericStory } from './generic.js';

// Manifiestos: siempre en el bundle (pequeños; sirven para el selector).
const MANIFESTS = Object.fromEntries(
  Object.entries(import.meta.glob('../../../content/stories/*/manifest.json', { eager: true, import: 'default' }))
    .map(([, m]) => [m.id, m]),
);
// Textos: un chunk por paquete, cargado solo cuando se usa (el SW los precachea; son pocos KB).
const STORY_LOADERS = Object.fromEntries(
  Object.entries(import.meta.glob('../../../content/stories/*/story.json', { import: 'default' }))
    .map(([p, load]) => [p.split('/').slice(-2)[0], load]),
);

export const DEFAULT_STORY_ID = INDEX.default;
export const GENERIC = genericStory(BADGE_IDS);

let current = resolveStory({ packs: {}, defaultId: DEFAULT_STORY_ID, generic: GENERIC, badgeIds: BADGE_IDS });
const listeners = new Set();

/** Paquetes instalados (para el selector). */
export function listPacks() {
  return Object.values(MANIFESTS).map((m) => ({ ...m, previewUrl: m.preview ? assetUrl(`stories/${m.id}/${m.preview}`) : null }));
}
export const hasPack = (id) => !!MANIFESTS[id];
export const currentStory = () => current;
export const onStoryChange = (fn) => (listeners.add(fn), () => listeners.delete(fn));
export const assetUrl = (rel) => `${import.meta.env?.BASE_URL || '/'}${rel}`;

async function loadPack(id) {
  if (!MANIFESTS[id] || !STORY_LOADERS[id]) return null;
  try {
    return { manifest: MANIFESTS[id], story: await STORY_LOADERS[id]() };
  } catch (e) {
    console.warn(`[historia] no se pudo cargar «${id}»`, e);
    return null;
  }
}

/** Id pedido por la URL (?story=<id>, solo vista previa: no se guarda). */
export function previewStoryId() {
  try { return new URLSearchParams(location.search).get('story'); } catch { return null; }
}

/**
 * Carga y aplica la historia: ?story= (vista previa) → ajuste del usuario → paquete por defecto → genérica.
 * @returns {Promise<object>} la historia resuelta
 */
export async function initStory(userStoryId) {
  storyPickerEnabled(); // registra ?historias=1|0 aunque el menú aún no se haya abierto
  const wanted = [previewStoryId(), userStoryId].find((id) => id && MANIFESTS[id]) || DEFAULT_STORY_ID;
  const packs = {};
  for (const id of new Set([DEFAULT_STORY_ID, wanted])) { const p = await loadPack(id); if (p) packs[id] = p; }
  current = resolveStory({ packs, activeId: wanted, defaultId: DEFAULT_STORY_ID, generic: GENERIC, badgeIds: BADGE_IDS });
  for (const [id, errs] of Object.entries(current.errors)) console.warn(`[historia] paquete «${id}» inválido, se usa el respaldo:`, errs);
  applyAssets(current);
  cacheActivePack(current);
  listeners.forEach((fn) => fn(current));
  return current;
}

export { validatePack, frameFor };

// ---------- Assets (perezosos: solo URLs; el navegador los pide cuando se muestran) ----------
function applyAssets(r) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.story = r.id;
  // Limpia overrides del paquete anterior y aplica los nuevos (solo claves permitidas por el schema).
  for (const k of [...root.style]) if (k.startsWith('--story-') || ['--primary', '--accent', '--on-primary', '--on-accent'].includes(k)) root.style.removeProperty(k);
  for (const [k, v] of Object.entries(r.assets.tokens || {})) root.style.setProperty(k, v);
  const bg = r.assets.backgrounds || {};
  if (bg.welcome) root.style.setProperty('--story-bg-welcome', `url("${assetUrl(bg.welcome)}")`);
  if (bg.play) root.style.setProperty('--story-bg-play', `url("${assetUrl(bg.play)}")`);
}

/** Lista plana de URLs de assets del paquete activo. */
export function packAssetUrls(assets) {
  const out = [];
  const walk = (o) => Object.entries(o || {}).forEach(([k, v]) => (k === 'tokens' ? null : typeof v === 'string' ? out.push(v) : walk(v)));
  walk(assets);
  return [...new Set(out)];
}

function cacheActivePack(r) {
  try {
    const urls = packAssetUrls(r.assets);
    navigator.serviceWorker?.controller?.postMessage({ type: 'CACHE_STORY', id: r.id, urls });
  } catch { /* sin SW */ }
}

/** Arte de carta del paquete (o null → animación genérica). */
export const cardArtUrl = (cardId) => (current.assets.cardArt?.[cardId] ? assetUrl(current.assets.cardArt[cardId]) : null);
export const frameUrl = (family, tier) => { const f = frameFor(current.assets, family, tier); return f ? assetUrl(f) : null; };
/** Emblema de escuela (imagen del paquete) o null → emblema SVG del código. */
export const emblemUrl = (family) => (current.assets.emblems?.[family] ? assetUrl(current.assets.emblems[family]) : null);
/** Poses del paquete para una carta (array de URLs, puede estar vacío). */
export const packPoseUrls = (cardId) => (current.assets.poses?.[cardId] || []).map(assetUrl);
/** URL pública de una ruta de contenido (p. ej. steps[].pose de una carta: «/art/…» o «art/…», relativa a public/). */
export const publicUrl = (p) => (p ? assetUrl(p.replace(/^\//, '')) : null);
export const sfxUrl = (name) => (current.assets.audio?.sfx?.[name] ? assetUrl(current.assets.audio.sfx[name]) : null);

/** El selector «Historia» del menú está oculto tras una bandera hasta que Brooks elija.
 *  Se activa con ?historias=1 (queda guardado en este dispositivo) y se desactiva con ?historias=0. */
export function storyPickerEnabled() {
  try {
    const q = new URLSearchParams(location.search).get('historias');
    if (q === '1') localStorage.setItem('snapfit.storyPicker', '1');
    if (q === '0') localStorage.removeItem('snapfit.storyPicker');
    return localStorage.getItem('snapfit.storyPicker') === '1';
  } catch { return false; }
}
