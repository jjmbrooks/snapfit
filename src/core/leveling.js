// Heurística de nivelación configurable (docs/02-ARCHITECTURE.md §5).
// BORRADOR: los umbrales los valida Entrenador (content/leveling.json).
import { MUSCLE_GROUPS, MIN_LEVEL, MAX_LEVEL } from './constants.js';

export const DEFAULT_LEVELING = {
  minCardsToLevelUp: 6, // N
  minDistinctDays: 3, // D
  minOkRatio: 0.7, // P (sobre cartas calificadas; sin calificación = neutral)
  noHardInLast: 3, // ninguna «duro» en las últimas k del grupo
  consecutiveHardToDrop: 3,
  minDaysBetweenLevelUps: 7, // tope semanal por grupo
};

/**
 * @param {Array<{groups:string[], level:number, effort:string|null, day:string, dayIdx:number, ts:number}>} dones cronológico
 * @param {object} params
 * @param {Record<string,number>} overrides nivel fijado a mano por grupo
 * @param {Record<string,number>} baseLevels nivel inicial por grupo (perfil + prueba rápida)
 * @param {Record<string,number>|null} caps tope por grupo (ver levelCaps); null = sin tope (solo 1–10)
 */
export function computeLevels(dones, params = DEFAULT_LEVELING, overrides = {}, baseLevels = {}, caps = null) {
  const p = { ...DEFAULT_LEVELING, ...params };
  const capOf = (g) => (Number.isInteger(caps?.[g]) ? clamp(caps[g]) : MAX_LEVEL);
  const st = {};
  for (const g of MUSCLE_GROUPS) {
    const b = Math.min(Number.isInteger(baseLevels?.[g]) ? clamp(baseLevels[g]) : MIN_LEVEL, capOf(g));
    st[g] = { level: b, bucket: [], recent: [], hardStreak: 0, lastUpDay: -Infinity, lastDayIdx: null };
  }
  const history = [];

  for (const d of dones) {
    for (const g of d.groups || []) {
      const s = st[g];
      if (!s) continue;
      s.cap = capOf(g);
      s.recent.push(d.effort);
      if (s.recent.length > p.noHardInLast) s.recent.shift();
      s.hardStreak = d.effort === 'duro' ? s.hardStreak + 1 : 0;

      if (s.hardStreak >= p.consecutiveHardToDrop && s.level > MIN_LEVEL) {
        s.level -= 1;
        s.bucket = [];
        s.hardStreak = 0;
        history.push({ group: g, level: s.level, dir: 'down', ts: d.ts });
        continue;
      }
      s.lastDayIdx = d.dayIdx;
      if ((d.level ?? 1) < s.level) continue; // cartas por debajo del nivel no cuentan para subir
      s.bucket.push(d);
      if (canLevelUp(s, d.dayIdx, p)) {
        s.level += 1;
        s.bucket = [];
        s.lastUpDay = d.dayIdx;
        history.push({ group: g, level: s.level, dir: 'up', ts: d.ts });
      }
    }
  }

  const byGroup = {};
  const progress = {};
  for (const g of MUSCLE_GROUPS) {
    const o = overrides?.[g];
    // El tope también aplica a los overrides: no hay cartas publicadas que justifiquen un nivel mayor.
    byGroup[g] = Math.min(Number.isInteger(o) ? clamp(o) : st[g].level, capOf(g));
    const b = st[g].bucket;
    const cards = Math.min(b.length, p.minCardsToLevelUp);
    const days = Math.min(new Set(b.map((x) => x.day)).size, p.minDistinctDays);
    const capped = byGroup[g] >= capOf(g) && capOf(g) < MAX_LEVEL;
    // fracción 0–1 hacia el siguiente nivel (cartas y días pesan igual)
    const ratio = byGroup[g] >= MAX_LEVEL ? 1 : (cards / p.minCardsToLevelUp + days / p.minDistinctDays) / 2;
    progress[g] = { cards, cardsNeeded: p.minCardsToLevelUp, days, daysNeeded: p.minDistinctDays, ratio, cap: capOf(g), capped };
  }
  const avg = MUSCLE_GROUPS.reduce((a, g) => a + byGroup[g], 0) / MUSCLE_GROUPS.length;
  return { byGroup, global: clamp(Math.floor(avg)), history, progress };
}

function canLevelUp(s, todayIdx, p) {
  if (s.level >= MAX_LEVEL || s.level >= (s.cap ?? MAX_LEVEL)) return false;
  if (todayIdx - s.lastUpDay < p.minDaysBetweenLevelUps) return false;
  const w = s.bucket;
  if (w.length < p.minCardsToLevelUp) return false;
  if (new Set(w.map((x) => x.day)).size < p.minDistinctDays) return false;
  const rated = w.filter((x) => x.effort);
  if (rated.length) {
    const ok = rated.filter((x) => x.effort !== 'duro').length / rated.length;
    if (ok < p.minOkRatio) return false;
  }
  if (s.recent.includes('duro')) return false;
  return true;
}

/**
 * Límite temporal (hasta completar la escalera 1–10, ver docs/ESCALERA.md):
 * nivel máximo por grupo = nivel de la carta publicada más alta de ese grupo + 1 (por primaryGroup).
 * Un grupo sin cartas publicadas queda en el nivel 1. Las cartas con `published: false` (borradores
 * de content/drafts/) no cuentan.
 * @param {Array<{level:number, primaryGroup?:string, muscleGroups?:string[], published?:boolean}>} cards
 * @returns {Record<string,number>}
 */
export function levelCaps(cards) {
  const caps = Object.fromEntries(MUSCLE_GROUPS.map((g) => [g, MIN_LEVEL]));
  for (const c of cards || []) {
    if (c?.published === false || !Number.isInteger(c?.level)) continue;
    const g = c.primaryGroup || c.muscleGroups?.[0];
    if (g in caps) caps[g] = Math.max(caps[g], clamp(c.level + 1));
  }
  return caps;
}

function clamp(n) {
  return Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, n));
}
