// Resolución PURA de la historia activa (sin DOM, testeable en Node).
// Cadena de fallback por campo: paquete activo → paquete por defecto → genérica.
// Un paquete que no pasa el schema se descarta entero (se reporta en `errors`).
import storySchema from '../../../content/stories/story.schema.json';
import manifestSchema from '../../../content/stories/manifest.schema.json';
import { validate } from './schema.js';

/** Valida un paquete { manifest, story }. Devuelve lista de errores (vacía = válido). */
export function validatePack(pack, { badgeIds = [] } = {}) {
  const errors = [
    ...validate(manifestSchema, pack.manifest, 'manifest'),
    ...validate(storySchema, pack.story, 'story'),
  ];
  if (pack.manifest?.id !== pack.story?.id) errors.push('manifest.id y story.id deben coincidir');
  for (const b of badgeIds) if (!pack.story?.badges?.[b]) errors.push(`story.badges.${b}: falta`);
  return errors;
}

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
/** Fusión profunda: objetos se mezclan; arrays y escalares del de la derecha reemplazan. */
export function deepMerge(...layers) {
  const out = {};
  for (const l of layers) {
    if (!isObj(l)) continue;
    for (const [k, v] of Object.entries(l)) out[k] = isObj(v) && isObj(out[k]) ? deepMerge(out[k], v) : isObj(v) ? deepMerge(v) : v;
  }
  return out;
}

/**
 * @param {{ packs: Record<string,{manifest,story}>, activeId?: string, defaultId: string, generic: object, badgeIds?: string[] }} p
 * @returns {{ id, manifest, story, assets, base, errors: Record<string,string[]> }}
 */
export function resolveStory({ packs, activeId, defaultId, generic, badgeIds = [] }) {
  const errors = {};
  const ok = (id) => {
    const p = packs[id];
    if (!p) return null;
    const e = validatePack(p, { badgeIds });
    if (e.length) { errors[id] = e; return null; }
    return p;
  };
  const def = ok(defaultId);
  const act = activeId && activeId !== defaultId ? ok(activeId) : def;
  const chosen = act || def;
  const story = deepMerge(generic, def?.story, act?.story);
  const id = chosen?.manifest.id || 'generic';
  // Assets: los del paquete activo; los que falten se toman del paquete por defecto. Rutas → public/stories/<id>/
  const withBase = (p) => (p ? prefixAssets(p.manifest.assets || {}, `stories/${p.manifest.id}/`) : {});
  const assets = deepMerge(withBase(def), act && act !== def ? withBase(act) : {});
  return { id, manifest: chosen?.manifest || { id: 'generic', name: 'SnapFit', defaultTheme: 'medianoche' }, story, assets, errors };
}

function prefixAssets(a, base) {
  const out = {};
  for (const [k, v] of Object.entries(a)) {
    if (k === 'tokens') out[k] = { ...v };
    else if (typeof v === 'string') out[k] = base + v;
    else if (isObj(v)) out[k] = prefixAssets(v, base);
  }
  return out;
}

/** Ruta de la piel de marco para una familia y tier (o null). */
export function frameFor(assets, family, tier) {
  const f = assets.frames || {};
  return f[family]?.[String(tier)] || f[family]?.all || f.default || null;
}
