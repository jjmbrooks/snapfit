import { makeEvent, seededRng } from '../../src/core/index.js';
export const TZ = -360;
// 2026-10-03 12:00 hora local UTC-6 = 18:00Z
export const NOW = Date.parse('2026-10-03T18:00:00Z');
const rng = seededRng(42);
export function done(dayOffset, opts = {}) {
  const hour = opts.hour ?? 12;
  const base = Date.parse('2026-10-03T00:00:00Z') + dayOffset * 86400e3 + (hour + 6) * 3600e3 + (opts.min ?? 0) * 60e3;
  return makeEvent('card_done', {
    cardId: opts.cardId ?? 'c1',
    level: opts.level ?? 1,
    groups: opts.groups ?? ['piernas'],
    place: opts.place,
  }, { now: base, tzOffsetMin: TZ, rng });
}
export function rate(ev, effort) {
  return makeEvent('effort_rated', { refId: ev.id, effort }, { now: Date.parse(ev.ts) + 1000, tzOffsetMin: TZ, rng });
}
