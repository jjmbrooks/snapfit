// Campos opcionales de la carta para el estilo C «grimorio arcade» (pura, sin DOM; la usan la UI,
// scripts/check-content.mjs y los tests). Compatibilidad hacia atrás:
//   steps: ["texto", …]  (formato original)  o  [{ text, pose? }, …]  (nuevo; máx. 3)
//   flavor: "línea de ambientación"  (también se acepta el campo antiguo flavorText)
//   breath: "indicación de respiración"  (opcional; si falta, la pone el paquete de historia o la interfaz)
export const MAX_STEPS = 3;
export const MAX_STEP_TEXT = 90;
export const MAX_FLAVOR = 60;
export const MAX_BREATH = 32;
const POSE_RE = /^(?!.*\.\.)(?!https?:)\/?[A-Za-z0-9_./-]+\.(png|jpg|jpeg|webp|gif|svg)$/;

/** Pasos normalizados: [{ text, pose|null }] (como mucho MAX_STEPS). */
export function normalizeSteps(c) {
  return (c?.steps || []).slice(0, MAX_STEPS).map((s) => (typeof s === 'string' ? { text: s, pose: null } : { text: s?.text || '', pose: s?.pose || null }));
}
export const flavorOf = (c) => c?.flavor || c?.flavorText || null;

/** «3 × 10 reps» / «10 reps» / «30 s» (sin textos de historia). Recibe la función de traducción. */
export function setsReps(c, t) {
  const d = c?.dose || {};
  const base = d.type === 'reps' ? t('card.repsUnit', { n: d.reps }) + (d.perSide ? t('card.perSide') : '') : d.type === 'hold' ? t('card.holdUnit', { n: d.durationSec }) : t('card.secUnit', { n: d.durationSec });
  return d.sets > 1 ? `${d.sets} × ${base}` : base;
}

/** Rango por nivel de carta: 1 bronce (1–3) · 2 plata (4–6) · 3 oro (7–9) · 4 gema (10). */
export const tierOf = (level) => (level >= 10 ? 4 : level >= 7 ? 3 : level >= 4 ? 2 : 1);
export const RANK_KEYS = { 1: 'bronce', 2: 'plata', 3: 'oro', 4: 'gema' };

/** Errores de los campos del estilo C (lista vacía = válido). */
export function cardExtrasErrors(c) {
  const e = [];
  if (!Array.isArray(c.steps) || !c.steps.length) e.push('steps vacío');
  else {
    if (c.steps.length > MAX_STEPS) e.push(`steps: máximo ${MAX_STEPS} (el reverso muestra 3 filas)`);
    c.steps.forEach((s, i) => {
      if (typeof s === 'string') { if (!s.trim()) e.push(`steps[${i}] vacío`); if (s.length > MAX_STEP_TEXT) e.push(`steps[${i}] > ${MAX_STEP_TEXT} caracteres`); return; }
      if (!s || typeof s !== 'object') return e.push(`steps[${i}] debe ser texto u objeto { text, pose? }`);
      const extra = Object.keys(s).filter((k) => !['text', 'pose'].includes(k));
      if (extra.length) e.push(`steps[${i}]: campos no permitidos ${extra.join(', ')}`);
      if (typeof s.text !== 'string' || !s.text.trim()) e.push(`steps[${i}].text vacío`);
      else if (s.text.length > MAX_STEP_TEXT) e.push(`steps[${i}].text > ${MAX_STEP_TEXT} caracteres`);
      if (s.pose != null && (typeof s.pose !== 'string' || !POSE_RE.test(s.pose))) e.push(`steps[${i}].pose: ruta de imagen inválida`);
    });
  }
  for (const [k, max] of [['flavor', MAX_FLAVOR], ['flavorText', MAX_FLAVOR], ['breath', MAX_BREATH]]) {
    if (c[k] == null) continue;
    if (typeof c[k] !== 'string' || !c[k].trim()) e.push(`${k} debe ser texto`);
    else if (c[k].length > max) e.push(`${k} > ${max} caracteres`);
  }
  return e;
}
