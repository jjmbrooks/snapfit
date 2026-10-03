// Racha diaria con comodín semanal (docs/01-PRODUCT.md §3).
import { addDays, weekIndex } from './time.js';

/**
 * @param {Set<string>} activeDays días con ≥1 carta
 * @param {string} today 'YYYY-MM-DD'
 * @param {{wildcardsPerWeek?:number}} opts
 */
export function computeStreak(activeDays, today, opts = {}) {
  const perWeek = opts.wildcardsPerWeek ?? 1;
  const used = new Map();
  let streak = 0;
  let d = activeDays.has(today) ? today : addDays(today, -1);
  let wildcardDays = [];
  for (let guard = 0; guard < 3660; guard++) {
    if (activeDays.has(d)) {
      streak++;
      d = addDays(d, -1);
      continue;
    }
    const w = weekIndex(d);
    const u = used.get(w) || 0;
    if (streak > 0 || d === addDays(today, -1)) {
      if (u < perWeek && activeDays.has(addDays(d, -1))) {
        used.set(w, u + 1);
        wildcardDays.push(d);
        d = addDays(d, -1);
        continue;
      }
    }
    break;
  }
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const k = addDays(today, -i);
    last7.push({ day: k, active: activeDays.has(k), wildcard: wildcardDays.includes(k) });
  }
  return {
    current: streak,
    wildcardUsedThisWeek: (used.get(weekIndex(today)) || 0) >= perWeek,
    wildcardDays,
    last7,
  };
}
