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
 */
export function computeLevels(dones, params = DEFAULT_LEVELING, overrides = {}) {
  const p = { ...DEFAULT_LEVELING, ...params };
  const st = {};
  for (const g of MUSCLE_GROUPS) {
    st[g] = { level: MIN_LEVEL, bucket: [], recent: [], hardStreak: 0, lastUpDay: -Infinity };
  }
  const history = [];

  for (const d of dones) {
    for (const g of d.groups || []) {
      const s = st[g];
      if (!s) continue;
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
  for (const g of MUSCLE_GROUPS) {
    const o = overrides[g];
    byGroup[g] = Number.isInteger(o) ? clamp(o) : st[g].level;
  }
  const avg = MUSCLE_GROUPS.reduce((a, g) => a + byGroup[g], 0) / MUSCLE_GROUPS.length;
  return { byGroup, global: clamp(Math.floor(avg)), history };
}

function canLevelUp(s, todayIdx, p) {
  if (s.level >= MAX_LEVEL) return false;
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

function clamp(n) {
  return Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, n));
}
