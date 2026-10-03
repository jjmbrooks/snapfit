import { describe, it, expect } from 'vitest';
import { deriveState, diffState, buildExport, importExport, eventsToCsv, MUSCLE_GROUPS } from '../../src/core/index.js';
import { done, rate, NOW, TZ } from './helpers.js';

describe('deriveState + badges', () => {
  it('estado vacío', () => {
    const s = deriveState([], { now: NOW, tzOffsetMin: TZ });
    expect(s).toMatchObject({ totalDone: 0, todayCount: 0, xp: 0, badges: [] });
    expect(s.history).toHaveLength(30);
  });
  it('primera carta, meta diaria, XP y madrugador', () => {
    const e1 = done(0, { hour: 7 });
    const evs = [e1, rate(e1, 'facil'), done(0), done(0)];
    const s = deriveState(evs, { now: NOW, tzOffsetMin: TZ, dailyGoal: 3 });
    expect(s.todayCount).toBe(3);
    expect(s.xp).toBe(15 + 10 + 10);
    expect(s.badges).toEqual(expect.arrayContaining(['first-card', 'daily-goal-1', 'early-bird']));
    expect(s.badges).not.toContain('night-owl');
  });
  it('racha 3, cuerpo completo y regreso', () => {
    const evs = [done(-20), ...MUSCLE_GROUPS.map((g, i) => done(-2 + (i % 3), { groups: [g] }))];
    const s = deriveState(evs, { now: NOW, tzOffsetMin: TZ });
    expect(s.streak.current).toBe(3);
    expect(s.badges).toEqual(expect.arrayContaining(['streak-3', 'full-body-week', 'comeback']));
  });
  it('diffState detecta insignias y niveles nuevos', () => {
    const before = deriveState([], { now: NOW, tzOffsetMin: TZ });
    const after = deriveState([done(0)], { now: NOW, tzOffsetMin: TZ });
    expect(diffState(before, after).newBadges).toEqual(['first-card']);
  });
  it('export/import JSON y CSV', () => {
    const evs = [done(0), done(-1)];
    const ex = buildExport({ events: evs.map((e) => ({ ...e, synced: 1 })), profile: { theme: 'selva' }, now: NOW, appVersion: 't' });
    expect(ex.events[0].synced).toBeUndefined();
    const r = importExport([evs[0]], JSON.parse(JSON.stringify(ex)));
    expect(r.added).toHaveLength(1);
    expect(r.merged).toHaveLength(2);
    expect(() => importExport([], { foo: 1 })).toThrow();
    expect(eventsToCsv(evs).split('\n')[0]).toContain('cardId');
  });
});
