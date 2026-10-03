import { describe, it, expect } from 'vitest';
import { computeStreak } from '../../src/core/index.js';

const today = '2026-10-03'; // sábado
describe('computeStreak', () => {
  it('cuenta días consecutivos incluyendo hoy', () => {
    expect(computeStreak(new Set(['2026-10-01', '2026-10-02', '2026-10-03']), today).current).toBe(3);
  });
  it('si hoy aún no hay carta, la racha sigue desde ayer', () => {
    expect(computeStreak(new Set(['2026-10-01', '2026-10-02']), today).current).toBe(2);
  });
  it('comodín cubre un día faltante por semana', () => {
    const s = computeStreak(new Set(['2026-09-30', '2026-10-01', '2026-10-03']), today);
    expect(s.current).toBe(3);
    expect(s.wildcardDays).toEqual(['2026-10-02']);
  });
  it('dos huecos en la misma semana rompen la racha', () => {
    expect(computeStreak(new Set(['2026-09-29', '2026-10-01', '2026-10-03']), today).current).toBe(2);
  });
  it('sin actividad = 0', () => {
    expect(computeStreak(new Set(), today).current).toBe(0);
  });
  it('last7 tiene 7 días terminando hoy', () => {
    const s = computeStreak(new Set([today]), today);
    expect(s.last7).toHaveLength(7);
    expect(s.last7[6]).toMatchObject({ day: today, active: true });
  });
});
