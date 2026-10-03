// Insignias (IDs = contratos de docs/01-PRODUCT.md §4). Nombres/copy viven en la UI.
import { MUSCLE_GROUPS } from './constants.js';

export const BADGE_IDS = [
  'first-card', 'daily-goal-1', 'streak-3', 'streak-7', 'streak-30',
  'cards-50', 'cards-250', 'cards-1000', 'full-body-week',
  ...MUSCLE_GROUPS.map((g) => `level-up-${g}`),
  'level-5', 'level-10', 'early-bird', 'night-owl', 'park-explorer', 'comeback',
];

/**
 * @param {object} s
 * @param {Array<{groups:string[], hour:number, place?:string, dayIdx:number}>} s.dones
 * @param {Record<string,number>} s.dayCounts conteo por día
 * @param {number} s.dailyGoal
 * @param {number} s.streak
 * @param {number} s.maxStreak
 * @param {{byGroup:Record<string,number>, global:number, history:any[]}} s.levels
 * @returns {string[]}
 */
export function computeBadges(s) {
  const out = new Set();
  const n = s.dones.length;
  if (n >= 1) out.add('first-card');
  if (Object.values(s.dayCounts).some((c) => c >= s.dailyGoal)) out.add('daily-goal-1');
  const best = Math.max(s.streak, s.maxStreak || 0);
  if (best >= 3) out.add('streak-3');
  if (best >= 7) out.add('streak-7');
  if (best >= 30) out.add('streak-30');
  if (n >= 50) out.add('cards-50');
  if (n >= 250) out.add('cards-250');
  if (n >= 1000) out.add('cards-1000');
  if (hasFullBodyWeek(s.dones)) out.add('full-body-week');
  for (const h of s.levels.history) if (h.dir === 'up') out.add(`level-up-${h.group}`);
  if (s.levels.global >= 5) out.add('level-5');
  if (s.levels.global >= 10) out.add('level-10');
  if (s.dones.some((d) => d.hour < 8)) out.add('early-bird');
  if (s.dones.some((d) => d.hour >= 21)) out.add('night-owl');
  if (s.dones.filter((d) => d.place === 'parque').length >= 10) out.add('park-explorer');
  if (hasComeback(s.dones)) out.add('comeback');
  return BADGE_IDS.filter((id) => out.has(id));
}

function hasFullBodyWeek(dones) {
  // ventana deslizante de 7 días
  for (let i = 0; i < dones.length; i++) {
    const end = dones[i].dayIdx;
    const seen = new Set();
    for (let j = i; j >= 0 && end - dones[j].dayIdx < 7; j--) for (const g of dones[j].groups) seen.add(g);
    if (MUSCLE_GROUPS.every((g) => seen.has(g))) return true;
  }
  return false;
}

function hasComeback(dones) {
  for (let i = 1; i < dones.length; i++) if (dones[i].dayIdx - dones[i - 1].dayIdx >= 7) return true;
  return false;
}
