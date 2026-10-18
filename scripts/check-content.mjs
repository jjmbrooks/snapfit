// Valida las cartas contra las reglas de docs/03-CONTENT.md.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { MUSCLE_GROUPS, PLACES, CARE_ZONES } from '../src/core/constants.js';
import { cardExtrasErrors } from '../src/ui/card/card-data.js';

const EQUIP = ['ninguno', 'silla', 'pared', 'toalla', 'mesa-firme', 'banca-parque', 'escalon'];
const errs = [];
const ids = new Set();
const all = [];
for (const f of readdirSync('content/cards').filter((x) => x.endsWith('.json'))) {
  for (const c of JSON.parse(readFileSync(`content/cards/${f}`, 'utf8'))) all.push([f, c]);
}
for (const [f, c] of all) {
  const e = (m) => errs.push(`${f}:${c.id}: ${m}`);
  if (!/^[a-z0-9-]+-l([1-9]|10)$/.test(c.id)) e('id no cumple <movimiento>-l<nivel>');
  if (ids.has(c.id)) e('id duplicado');
  ids.add(c.id);
  if (!(c.level >= 1 && c.level <= 10) || !c.id.endsWith(`-l${c.level}`)) e('level inconsistente');
  if (!c.muscleGroups?.length || c.muscleGroups.some((g) => !MUSCLE_GROUPS.includes(g))) e('muscleGroups inválidos');
  if (!c.muscleGroups.includes(c.primaryGroup)) e('primaryGroup fuera de muscleGroups');
  if (!['reps', 'time', 'hold'].includes(c.dose?.type)) e('dose.type inválido');
  if (!(c.dose?.estimatedSec <= 120)) e('estimatedSec > 120');
  if (c.locations.some((l) => l !== 'cualquiera' && !PLACES.includes(l))) e('locations inválidas');
  if (c.equipment.some((x) => !EQUIP.includes(x))) e('equipment inválido');
  if (c.careZones.some((z) => !CARE_ZONES.includes(z))) e('careZones inválidas');
  for (const m of cardExtrasErrors(c)) e(m);
  if (!c.draft && !c.sources?.length) e('carta publicada sin sources');
  if (c.draft && c.sources?.length === 0 && c.reviewedBy) e('borrador marcado como revisado');
  if (c.license !== 'CC-BY-4.0') e('license debe ser CC-BY-4.0');
}
for (const [f, c] of all) for (const k of ['easier', 'harder']) if (c[k] && !ids.has(c[k])) errs.push(`${f}:${c.id}: ${k} → ${c[k]} no existe`);

// Borradores (content/drafts/): no publicados, fuera de todo mazo. Mismas reglas de schema salvo el tope de pasos
// (3–5 pasos; el reverso publicado admite MAX_STEPS) y las fuentes (las aporta Entrenador al validar).
const drafts = [];
const warns = [];
for (const f of existsSync('content/drafts') ? readdirSync('content/drafts').filter((x) => x.endsWith('.json')) : []) {
  for (const c of JSON.parse(readFileSync(`content/drafts/${f}`, 'utf8'))) drafts.push([`drafts/${f}`, c]);
}
const deckIds = new Set(readdirSync('content/decks').filter((x) => x.endsWith('.json')).flatMap((f) => JSON.parse(readFileSync(`content/decks/${f}`, 'utf8')).cards || []));
const draftIds = new Set();
for (const [f, c] of drafts) {
  const e = (m) => errs.push(`${f}:${c.id}: ${m}`);
  if (c.published !== false || c.draft !== true) e('borrador debe tener draft: true y published: false');
  if (!/^[a-z0-9-]+-l([1-9]|10)$/.test(c.id)) e('id no cumple <movimiento>-l<nivel>');
  if (ids.has(c.id) || draftIds.has(c.id)) e('id duplicado');
  draftIds.add(c.id);
  if (deckIds.has(c.id)) e('borrador listado en un mazo');
  if (!(c.level >= 1 && c.level <= 10) || !c.id.endsWith(`-l${c.level}`)) e('level inconsistente');
  if (!c.muscleGroups?.length || c.muscleGroups.some((g) => !MUSCLE_GROUPS.includes(g))) e('muscleGroups inválidos');
  if (!c.muscleGroups.includes(c.primaryGroup)) e('primaryGroup fuera de muscleGroups');
  if (!['reps', 'time', 'hold'].includes(c.dose?.type)) e('dose.type inválido');
  if (!(c.dose?.estimatedSec <= 120)) e('estimatedSec > 120');
  if (c.locations.some((l) => l !== 'cualquiera' && !PLACES.includes(l))) e('locations inválidas');
  if (c.equipment.some((x) => !EQUIP.includes(x))) e('equipment inválido');
  if (c.careZones.some((z) => !CARE_ZONES.includes(z))) e('careZones inválidas');
  if (!(c.steps?.length >= 3 && c.steps.length <= 5)) e('borrador: 3 a 5 pasos');
  // Texto largo en pasos = aviso (hay que acortarlo antes de publicar), no error.
  for (const m of cardExtrasErrors({ ...c, steps: c.steps.slice(0, 3) })) (/caracteres$/.test(m) ? warns : errs).push(`${f}:${c.id}: ${m}`);
  c.steps.slice(3).forEach((s, i) => { if (typeof s !== 'string' || !s.trim()) e(`steps[${i + 3}] vacío`); else if (s.length > 90) warns.push(`${f}:${c.id}: steps[${i + 3}] > 90 caracteres`); });
  if (!c.contraindications?.length) e('borrador sin contraindicaciones');
  if (typeof c.progression !== 'string' || !c.progression.trim()) e('borrador sin criterio de progresión');
  if (c.license !== 'CC-BY-4.0') e('license debe ser CC-BY-4.0');
}
for (const [f, c] of drafts) for (const k of ['easier', 'harder']) if (c[k] && !ids.has(c[k]) && !draftIds.has(c[k])) errs.push(`${f}:${c.id}: ${k} → ${c[k]} no existe`);
if (warns.length) console.warn(`avisos (borradores, corregir antes de publicar):\n${warns.join('\n')}`);
if (errs.length) { console.error(errs.join('\n')); process.exit(1); }
console.log(`contenido OK (${all.length} cartas, ${all.filter(([, c]) => c.draft).length} borradores; ${drafts.length} sin publicar en content/drafts)`);
