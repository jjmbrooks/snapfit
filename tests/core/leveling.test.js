import { describe, it, expect } from 'vitest';
import { computeLevels, DEFAULT_LEVELING } from '../../src/core/index.js';

const d = (day, effort = null, groups = ['piernas'], level = 1) => ({ groups, level, effort, day: `d${day}`, dayIdx: day, ts: day });

describe('computeLevels', () => {
  it('empieza en nivel 1', () => {
    const r = computeLevels([]);
    expect(r.byGroup.piernas).toBe(1);
    expect(r.global).toBe(1);
  });
  it('sube tras N cartas en D días distintos', () => {
    const dones = [1, 1, 2, 2, 3, 3].map((x) => d(x, 'bien'));
    const r = computeLevels(dones);
    expect(r.byGroup.piernas).toBe(2);
    expect(r.history[0]).toMatchObject({ group: 'piernas', level: 2, dir: 'up' });
  });
  it('no sube si faltan días distintos', () => {
    const r = computeLevels([1, 1, 1, 1, 1, 1, 1].map((x) => d(x)));
    expect(r.byGroup.piernas).toBe(1);
  });
  it('respeta el tope semanal entre subidas', () => {
    const dones = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6].map((x) => d(x, 'facil'));
    expect(computeLevels(dones).byGroup.piernas).toBe(2);
    const later = dones.concat([10, 10, 11, 11, 12, 12].map((x) => d(x, 'facil', ['piernas'], 2)));
    expect(computeLevels(later).byGroup.piernas).toBe(3);
  });
  it('«duro» reciente bloquea la subida y 3 seguidos bajan', () => {
    const dones = [1, 1, 2, 2, 3].map((x) => d(x, 'bien')).concat([d(3, 'duro')]);
    expect(computeLevels(dones).byGroup.piernas).toBe(1);
    const up = [1, 1, 2, 2, 3, 3].map((x) => d(x, 'bien'));
    const down = up.concat([d(4, 'duro', ['piernas'], 2), d(4, 'duro', ['piernas'], 2), d(5, 'duro', ['piernas'], 2)]);
    const r = computeLevels(down);
    expect(r.byGroup.piernas).toBe(1);
    expect(r.history.at(-1).dir).toBe('down');
  });
  it('los overrides mandan', () => {
    expect(computeLevels([], DEFAULT_LEVELING, { core: 4 }).byGroup.core).toBe(4);
  });
});
