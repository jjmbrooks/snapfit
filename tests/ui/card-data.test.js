// Campos de carta del estilo C (steps con pose, flavor, breath): formato nuevo + compatibilidad con el antiguo.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { normalizeSteps, flavorOf, setsReps, tierOf, cardExtrasErrors, MAX_STEPS } from '../../src/ui/card/card-data.js';
import { t } from '../../src/ui/i18n/es.js';

const cards = JSON.parse(readFileSync(new URL('../../content/cards/adulto-general.draft.json', import.meta.url), 'utf8'));
const base = { steps: ['Uno', 'Dos', 'Tres'], dose: { type: 'reps', reps: 10, sets: 1 } };

describe('carta: steps / flavor / breath', () => {
  it('formato antiguo (texto) se normaliza a { text, pose: null }', () => {
    expect(normalizeSteps(base)).toEqual([{ text: 'Uno', pose: null }, { text: 'Dos', pose: null }, { text: 'Tres', pose: null }]);
  });
  it('formato nuevo { text, pose } y mezcla', () => {
    const c = { ...base, steps: [{ text: 'A', pose: '/art/vitalia/poses/a-1.png' }, 'B', { text: 'C' }] };
    expect(normalizeSteps(c)).toEqual([{ text: 'A', pose: '/art/vitalia/poses/a-1.png' }, { text: 'B', pose: null }, { text: 'C', pose: null }]);
    expect(cardExtrasErrors(c)).toEqual([]);
  });
  it(`máximo ${MAX_STEPS} pasos, rutas de pose seguras y campos conocidos`, () => {
    expect(cardExtrasErrors({ ...base, steps: ['a', 'b', 'c', 'd'] }).join()).toMatch(/máximo 3/);
    expect(cardExtrasErrors({ ...base, steps: [{ text: 'a', pose: 'https://x.com/a.png' }] }).join()).toMatch(/pose/);
    expect(cardExtrasErrors({ ...base, steps: [{ text: 'a', pose: '../secreto.png' }] }).join()).toMatch(/pose/);
    expect(cardExtrasErrors({ ...base, steps: [{ text: 'a', video: 'x.mp4' }] }).join()).toMatch(/no permitidos/);
    expect(cardExtrasErrors({ ...base, steps: [{ text: '' }] }).join()).toMatch(/vacío/);
    expect(cardExtrasErrors({ ...base, steps: [] }).join()).toMatch(/vacío/);
  });
  it('flavor (nuevo) tiene prioridad sobre flavorText (antiguo); breath opcional con límite', () => {
    expect(flavorOf({ flavor: 'nuevo', flavorText: 'viejo' })).toBe('nuevo');
    expect(flavorOf({ flavorText: 'viejo' })).toBe('viejo');
    expect(flavorOf({})).toBeNull();
    expect(cardExtrasErrors({ ...base, flavor: 'x'.repeat(61) }).join()).toMatch(/flavor/);
    expect(cardExtrasErrors({ ...base, breath: 'x'.repeat(33) }).join()).toMatch(/breath/);
  });
  it('dosis «series × reps» y rango por nivel', () => {
    expect(setsReps(base, t)).toBe('10 reps');
    expect(setsReps({ dose: { type: 'reps', reps: 10, sets: 3 } }, t)).toBe('3 × 10 reps');
    expect(setsReps({ dose: { type: 'hold', durationSec: 20, sets: 1 } }, t)).toBe('20 s sostén');
    expect([1, 3, 4, 6, 7, 9, 10].map(tierOf)).toEqual([1, 1, 2, 2, 3, 3, 4]);
  });
  it('todas las cartas del repo cumplen (compatibilidad hacia atrás)', () => {
    for (const c of cards) expect(cardExtrasErrors(c), c.id).toEqual([]);
  });
});
