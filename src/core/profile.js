// Perfil del jugador → mazo y niveles iniciales. Puro.
// BORRADOR: reglas provisionales de Codelius; Entrenador (t_78a921ff) validará cortes y topes.
import { MUSCLE_GROUPS, MIN_LEVEL } from './constants.js';

export const SEXES = ['mujer', 'hombre', 'otro', 'prefiero-no-decir'];
export const FITNESS = ['sedentario', 'ligero', 'activo', 'muy-activo'];
export const MIN_AGE = 13;
export const MAX_AGE = 100;

/** Prueba rápida autorreportada: cada respuesta es un índice 0–2. */
export const QUICK_TEST = [
  { id: 'sentadillas', groups: ['piernas', 'gluteos'], question: '¿Cuántas sentadillas a una silla haces seguidas, cómodo y sin dolor?', options: ['0–5', '6–15', '16 o más'] },
  { id: 'flexiones', groups: ['empuje', 'traccion'], question: '¿Cuántas flexiones apoyando las manos en la pared haces seguidas?', options: ['0–5', '6–15', '16 o más'] },
  { id: 'plancha', groups: ['core'], question: '¿Cuánto aguantas una plancha con rodillas apoyadas?', options: ['Menos de 15 s', '15–45 s', 'Más de 45 s'] },
];

const FITNESS_BASE = { sedentario: 1, ligero: 1, activo: 2, 'muy-activo': 3 };

/** Devuelve null si el perfil es válido o un mensaje de error en español. */
export function validateProfile(p) {
  if (!p) return 'Perfil vacío';
  if (!Number.isInteger(p.age) || p.age < MIN_AGE || p.age > MAX_AGE) return `La edad debe estar entre ${MIN_AGE} y ${MAX_AGE} años`;
  if (!SEXES.includes(p.sex)) return 'Elige una opción de sexo';
  if (!FITNESS.includes(p.fitness)) return 'Elige tu condición física';
  for (const q of QUICK_TEST) {
    const a = p.test?.[q.id];
    if (!Number.isInteger(a) || a < 0 || a > 2) return 'Completa la prueba rápida';
  }
  return null;
}

/** Banda de edad usada para mazo y topes. */
export function ageBand(age) {
  if (age < 18) return 'adolescente';
  if (age >= 65) return 'mayor';
  return 'adulto';
}

/**
 * Elige el mazo según el perfil, con alternativa si el mazo ideal aún no existe.
 * @param {object} p perfil válido
 * @param {string[]} available ids de mazos disponibles
 * @returns {{deckId:string, ideal:string, adjustments:string|null, reason:string}}
 */
export function recommendDeck(p, available) {
  const band = ageBand(p.age);
  const ideal = band === 'mayor' ? 'mayores' : band === 'adolescente' ? 'adolescentes' : 'adulto-general';
  const deckId = available.includes(ideal) ? ideal : 'adulto-general';
  const adjKey = p.sex === 'mujer' ? 'ajustes-mujeres' : p.sex === 'hombre' ? 'ajustes-hombres' : null;
  const adjustments = adjKey && available.includes(adjKey) ? adjKey : null;
  const reason = deckId === ideal ? `Mazo ${ideal} por edad (${band})` : `Mazo ${ideal} aún no disponible; se usa adulto-general con topes de ${band}`;
  return { deckId, ideal, adjustments, reason };
}

/** Tope de nivel inicial por banda de edad y condición. */
export function startCap(p) {
  let cap = 3;
  if (p.fitness === 'sedentario') cap = 2;
  const band = ageBand(p.age);
  if (band === 'mayor') cap = Math.min(cap, 2);
  return cap;
}

/**
 * Niveles iniciales por grupo (1–3) a partir de condición física y prueba rápida.
 * El sexo NO cambia el nivel mientras Entrenador no documente ajustes con evidencia.
 */
export function initialLevels(p) {
  const cap = startCap(p);
  const base = FITNESS_BASE[p.fitness] ?? 1;
  const out = {};
  for (const g of MUSCLE_GROUPS) out[g] = Math.min(cap, base);
  for (const q of QUICK_TEST) {
    const score = p.test?.[q.id] ?? 0;
    const lvl = Math.max(MIN_LEVEL, Math.min(cap, 1 + score, base + 1));
    for (const g of q.groups) out[g] = lvl;
  }
  return out;
}
