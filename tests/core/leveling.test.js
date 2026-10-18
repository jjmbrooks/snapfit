import { describe, it, expect } from 'vitest';
import { computeLevels, levelCaps, DEFAULT_LEVELING } from '../../src/core/index.js';
import cards from '../../content/cards/adulto-general.draft.json';

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

describe('límite temporal por grupo (levelCaps)', () => {
  const card = (primaryGroup, level, extra = {}) => ({ primaryGroup, muscleGroups: [primaryGroup], level, ...extra });
  it('tope = carta publicada más alta del grupo + 1; sin cartas = 1', () => {
    const caps = levelCaps([card('piernas', 1), card('piernas', 2), card('empuje', 1)]);
    expect(caps.piernas).toBe(3);
    expect(caps.empuje).toBe(2);
    expect(caps.traccion).toBe(1);
  });
  it('los borradores (published: false) no cuentan', () => {
    expect(levelCaps([card('core', 1), card('core', 5, { published: false })]).core).toBe(2);
  });
  it('nunca pasa de 10', () => {
    expect(levelCaps([card('cardio', 10)]).cardio).toBe(10);
  });
  it('no sube por encima del tope aunque cumpla los criterios', () => {
    const caps = { piernas: 2 };
    const block = (from, lvl) => [from, from, from + 1, from + 1, from + 2, from + 2].map((x) => d(x, 'facil', ['piernas'], lvl));
    const dones = block(1, 1).concat(block(10, 2), block(20, 2));
    expect(computeLevels(dones).byGroup.piernas).toBe(3); // sin tope sí sube
    const r = computeLevels(dones, DEFAULT_LEVELING, {}, {}, caps);
    expect(r.byGroup.piernas).toBe(2);
    expect(r.history.filter((h) => h.dir === 'up')).toHaveLength(1);
    expect(r.progress.piernas).toMatchObject({ cap: 2, capped: true });
  });
  it('el tope recorta el nivel inicial del perfil y los overrides', () => {
    const caps = { core: 2, empuje: 3 };
    const r = computeLevels([], DEFAULT_LEVELING, { empuje: 6 }, { core: 4 }, caps);
    expect(r.byGroup.core).toBe(2);
    expect(r.byGroup.empuje).toBe(3);
    expect(r.progress.core.capped).toBe(true);
  });
  it('sin tope el comportamiento es el de antes', () => {
    expect(computeLevels([], DEFAULT_LEVELING, { core: 4 }).byGroup.core).toBe(4);
    expect(computeLevels([]).progress.piernas.capped).toBe(false);
  });
  it('mazo actual: ningún grupo pasa del nivel 3', () => {
    const caps = levelCaps(cards);
    for (const v of Object.values(caps)) expect(v).toBeLessThanOrEqual(3);
    expect(caps.piernas).toBe(3);
    expect(caps.cardio).toBe(2);
  });
});

