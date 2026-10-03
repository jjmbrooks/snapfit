// Estado derivado: siempre recalculable desde el registro de eventos.
import { MUSCLE_GROUPS } from './constants.js';
import { dayKey, dayIndex, localHour, toMs, addDays } from './time.js';
import { computeLevels } from './leveling.js';
import { computeStreak } from './streaks.js';
import { computeBadges } from './achievements.js';
import { xpForCard } from './xp.js';

/**
 * @param {Array<object>} events
 * @param {object} opts
 * @param {number} opts.now
 * @param {number} opts.tzOffsetMin
 * @param {number} [opts.dailyGoal]
 * @param {object} [opts.leveling]
 * @param {Record<string,number>} [opts.levelOverrides]
 */
export function deriveState(events, opts) {
  const { now, tzOffsetMin = 0, dailyGoal = 3, leveling, levelOverrides } = opts;
  const efforts = new Map();
  for (const e of events) if (e.type === 'effort_rated') efforts.set(e.refId, e.effort);

  const dones = events
    .filter((e) => e.type === 'card_done')
    .map((e) => {
      const ts = toMs(e.ts);
      const tz = e.tzOffsetMin ?? tzOffsetMin;
      const day = dayKey(ts, tz);
      return {
        id: e.id,
        cardId: e.cardId,
        groups: e.groups || [],
        level: e.level ?? 1,
        effort: efforts.get(e.id) ?? null,
        place: e.place,
        ts,
        day,
        dayIdx: dayIndex(day),
        hour: localHour(ts, tz),
      };
    })
    .sort((a, b) => a.ts - b.ts);

  const skips = events.filter((e) => e.type === 'card_skipped').length;
  const levels = computeLevels(dones, leveling, levelOverrides);
  const today = dayKey(now, tzOffsetMin);
  const dayCounts = {};
  for (const d of dones) dayCounts[d.day] = (dayCounts[d.day] || 0) + 1;
  const activeDays = new Set(Object.keys(dayCounts));
  const streak = computeStreak(activeDays, today);
  const maxStreak = longestRun(activeDays);
  const xp = dones.reduce((a, d) => a + xpForCard(d.level, !!d.effort), 0);

  const todayGroups = {};
  const weekGroups = {};
  const weekStart = addDays(today, -6);
  for (const d of dones) {
    for (const g of d.groups) {
      if (d.day === today) todayGroups[g] = (todayGroups[g] || 0) + 1;
      if (d.day >= weekStart) weekGroups[g] = (weekGroups[g] || 0) + 1;
    }
  }
  const history = [];
  for (let i = 29; i >= 0; i--) {
    const k = addDays(today, -i);
    history.push({ day: k, count: dayCounts[k] || 0 });
  }

  const badges = computeBadges({ dones, dayCounts, dailyGoal, streak: streak.current, maxStreak, levels });

  return {
    totalDone: dones.length,
    totalSkipped: skips,
    todayCount: dayCounts[today] || 0,
    dailyGoal,
    xp,
    levels,
    streak,
    maxStreak,
    todayGroups,
    weekGroups,
    weekCoverage: MUSCLE_GROUPS.filter((g) => weekGroups[g] > 0),
    history,
    badges,
    recent: dones.slice(-20).map((d) => ({ cardId: d.cardId, ts: d.ts })),
    lastDoneTs: dones.length ? dones[dones.length - 1].ts : null,
  };
}

function longestRun(days) {
  const idx = [...days].map(dayIndex).sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  for (let i = 0; i < idx.length; i++) {
    run = i > 0 && idx[i] === idx[i - 1] + 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }
  return best;
}

/** Diferencias entre dos estados (para animaciones y toasts). */
export function diffState(prev, next) {
  const newBadges = next.badges.filter((b) => !prev.badges.includes(b));
  const levelChanges = [];
  for (const g of MUSCLE_GROUPS) {
    const a = prev.levels.byGroup[g];
    const b = next.levels.byGroup[g];
    if (a !== b) levelChanges.push({ group: g, from: a, to: b });
  }
  return { newBadges, levelChanges, globalFrom: prev.levels.global, globalTo: next.levels.global };
}
