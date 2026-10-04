// Cargador de textos. NO escribas textos aquí: viven en archivos de contenido para que historia y copy
// se editen sin tocar código (docs/PARALLEL-WORK.md, workstream «story-copy»).
//   content/copy/es.json                 → textos de interfaz (botones, errores, etiquetas), iguales en toda historia
//   content/stories/<id>/story.json      → narrativa del paquete activo (docs/story/STORY-PACKS.md)
// Los objetos narrativos de abajo se rellenan con el paquete que resuelve src/ui/story/ y se actualizan
// en el mismo objeto al cambiar de historia (las vistas los leen en cada render).
import COPY from '../../../content/copy/es.json';
import { currentStory, onStoryChange } from '../story/index.js';

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

export const STORY = {};
export const FAMILY_NAMES = {};
export const FAMILY_ICONS = {};
export const TIER_NAMES = {};
export const REGION_NAMES = {};
export const GUIDE = {};
export const REWARDS = [];
export const REMINDER_COPY = [];
export const BADGES = {};

const fill = (o, v) => { for (const k of Object.keys(o)) delete o[k]; Object.assign(o, v); };
const fillArr = (a, v) => { a.length = 0; a.push(...v); };
function applyStory({ story: S }) {
  fill(STORY, { ...S, lines: S.welcome.lines, cta: S.welcome.cta, note: S.welcome.note });
  fill(FAMILY_NAMES, Object.fromEntries(Object.entries(S.families).map(([g, f]) => [g, f.name])));
  fill(FAMILY_ICONS, Object.fromEntries(Object.entries(S.families).map(([g, f]) => [g, f.icon])));
  fill(TIER_NAMES, S.tiers);
  fill(REGION_NAMES, S.regions);
  fill(GUIDE, S.guide);
  fillArr(REWARDS, S.rewards);
  fillArr(REMINDER_COPY, S.reminders);
  fill(BADGES, Object.fromEntries(Object.entries(S.badges).map(([k, b]) => [k, [b.name, b.desc]])));
}
applyStory(currentStory());
onStoryChange(applyStory);
