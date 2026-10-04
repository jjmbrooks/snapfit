// Valida las cartas contra las reglas de docs/03-CONTENT.md.
import { readFileSync, readdirSync } from 'node:fs';
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
if (errs.length) { console.error(errs.join('\n')); process.exit(1); }
console.log(`contenido OK (${all.length} cartas, ${all.filter(([, c]) => c.draft).length} borradores)`);
