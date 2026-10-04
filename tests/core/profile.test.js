import { describe, it, expect } from 'vitest';
import { validateProfile, recommendDeck, initialLevels, ageBand, computeLevels, deriveState } from '../../src/core/index.js';

const base = { age: 34, sex: 'hombre', fitness: 'activo', test: { sentadillas: 2, flexiones: 1, plancha: 0 } };

describe('perfil', () => {
  it('valida edad, sexo, condición y prueba', () => {
    expect(validateProfile(base)).toBeNull();
    expect(validateProfile({ ...base, age: 12 })).toMatch(/edad/);
    expect(validateProfile({ ...base, sex: 'x' })).toMatch(/sexo/);
    expect(validateProfile({ ...base, fitness: null })).toMatch(/condición/);
    expect(validateProfile({ ...base, test: { sentadillas: 1 } })).toMatch(/prueba/);
  });
  it('bandas de edad', () => {
    expect(ageBand(15)).toBe('adolescente');
    expect(ageBand(40)).toBe('adulto');
    expect(ageBand(70)).toBe('mayor');
  });
  it('elige mazo por edad con alternativa si no existe', () => {
    expect(recommendDeck({ ...base, age: 70 }, ['adulto-general', 'mayores']).deckId).toBe('mayores');
    const r = recommendDeck({ ...base, age: 70 }, ['adulto-general']);
    expect(r).toMatchObject({ deckId: 'adulto-general', ideal: 'mayores' });
    expect(recommendDeck({ ...base, sex: 'mujer' }, ['adulto-general', 'ajustes-mujeres']).adjustments).toBe('ajustes-mujeres');
    expect(recommendDeck(base, ['adulto-general']).adjustments).toBeNull();
  });
  it('niveles iniciales según prueba y condición, con topes', () => {
    const l = initialLevels(base);
    expect(l.piernas).toBe(3);
    expect(l.empuje).toBe(2);
    expect(l.core).toBe(1);
    expect(l.cardio).toBe(2);
    expect(initialLevels({ ...base, fitness: 'sedentario' }).piernas).toBe(2);
    expect(initialLevels({ ...base, age: 72 }).piernas).toBe(2);
    expect(initialLevels({ ...base, fitness: 'muy-activo', test: { sentadillas: 0, flexiones: 0, plancha: 0 } }).piernas).toBe(1);
  });
  it('el sexo no cambia los niveles (sin evidencia documentada aún)', () => {
    expect(initialLevels({ ...base, sex: 'mujer' })).toEqual(initialLevels(base));
  });
  it('los niveles iniciales alimentan la nivelación y el estado', () => {
    expect(computeLevels([], undefined, {}, { core: 3 }).byGroup.core).toBe(3);
    const s = deriveState([], { now: Date.now(), baseLevels: initialLevels(base) });
    expect(s.levels.byGroup.piernas).toBe(3);
    expect(s.levels.progress.piernas).toMatchObject({ cards: 0, ratio: 0 });
  });
});
