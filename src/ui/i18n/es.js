// Cargador de textos. NO escribas textos aquí: viven en archivos de contenido para que historia y copy
// se editen sin tocar código (docs/PARALLEL-WORK.md, workstream «story-copy»).
//   content/copy/es.json      → textos de interfaz (botones, errores, etiquetas)
//   content/story/<id>.json   → narrativa: bienvenida, familias, tiers, recompensas, insignias, recordatorios
//   content/story/active.json → historia activa. Para previsualizar otra sin cambiarla: ?story=<id>
import COPY from '../../../content/copy/es.json';
import ACTIVE from '../../../content/story/active.json';

const stories = import.meta.glob('../../../content/story/*.json', { eager: true, import: 'default' });
export const STORIES = Object.fromEntries(
  Object.entries(stories).map(([p, v]) => [p.split('/').pop().replace('.json', ''), v]).filter(([id]) => id !== 'active'),
);

function pickStory() {
  let id = ACTIVE.active;
  try {
    const q = new URLSearchParams(globalThis.location?.search || '').get('story');
    if (q && STORIES[q]) id = q;
  } catch { /* sin location (tests) */ }
  return STORIES[id] || STORIES[ACTIVE.active];
}
export const STORY_DATA = pickStory();

/** Busca una clave con puntos en el copy e interpola {variables}. Devuelve la clave si falta (visible en QA). */
export function t(key, vars = {}) {
  const v = key.split('.').reduce((o, k) => (o == null ? o : o[k]), COPY);
  if (typeof v !== 'string') return key;
  return v.replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m));
}
export { COPY };

// Exportaciones con la forma histórica (las vistas existentes las usan).
const N = COPY.names;
export const THEME_NAMES = N.themes;
export const GROUP_NAMES = N.groups;
export const PLACE_NAMES = N.places;
export const ZONE_NAMES = N.zones;
export const EFFORT_NAMES = N.effort;
export const REMINDER_NAMES = N.reminders;
export const SEX_NAMES = N.sexes;
export const FITNESS_NAMES = N.fitness;
export const QUICK_TEST_COPY = COPY.quickTest;

const S = STORY_DATA;
export const STORY = { title: S.title, lines: S.welcome.lines, cta: S.welcome.cta, note: S.welcome.note, ...S };
export const FAMILY_NAMES = Object.fromEntries(Object.entries(S.families).map(([g, f]) => [g, f.name]));
export const FAMILY_ICONS = Object.fromEntries(Object.entries(S.families).map(([g, f]) => [g, f.icon]));
export const TIER_NAMES = S.tiers;
export const REWARDS = S.rewards;
export const REMINDER_COPY = S.reminders;
export const BADGES = Object.fromEntries(Object.entries(S.badges).map(([k, b]) => [k, [b.name, b.desc]]));
