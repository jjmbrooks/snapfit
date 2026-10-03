import { describe, it, expect } from 'vitest';
import { nextCard, candidatePool, seededRng } from '../../src/core/index.js';

const cards = [
  { id: 'a-l1', primaryGroup: 'piernas', muscleGroups: ['piernas'], level: 1, locations: ['casa'], careZones: ['rodilla'], easier: 'a0-l1' },
  { id: 'a0-l1', primaryGroup: 'piernas', muscleGroups: ['piernas'], level: 1, locations: ['casa'], careZones: [] },
  { id: 'b-l1', primaryGroup: 'core', muscleGroups: ['core'], level: 1, locations: ['cualquiera'], careZones: [] },
  { id: 'c-l3', primaryGroup: 'empuje', muscleGroups: ['empuje'], level: 3, locations: ['parque'], careZones: [] },
];
const now = 1e12;

describe('deck-engine', () => {
  it('nunca devuelve cartas con zona a cuidar (usa variante fácil)', () => {
    const pool = candidatePool(cards, { careZones: ['rodilla'], now });
    expect(pool.map((c) => c.id)).not.toContain('a-l1');
    expect(pool.map((c) => c.id)).toContain('a0-l1');
  });
  it('filtra por lugar con «cualquiera» siempre válido', () => {
    const pool = candidatePool(cards, { places: ['oficina'], now });
    expect(pool.map((c) => c.id)).toEqual(['b-l1']);
  });
  it('filtra por nivel ±1 y relaja si no hay opciones', () => {
    const pool = candidatePool(cards, { places: ['parque'], levels: { empuje: 1 }, now });
    expect(pool.map((c) => c.id)).toEqual(['b-l1']);
  });
  it('«Otra carta» excluye la actual', () => {
    for (let s = 0; s < 20; s++) expect(nextCard(cards, { excludeId: 'b-l1', now }, seededRng(s)).id).not.toBe('b-l1');
  });
  it('es reproducible con seed y penaliza lo reciente', () => {
    const ctx = { now, recent: [{ cardId: 'b-l1', ts: now - 1000 }], weekGroups: {}, levels: {} };
    const a = nextCard(cards, ctx, seededRng(7)).id;
    expect(nextCard(cards, ctx, seededRng(7)).id).toBe(a);
    let b = 0;
    for (let s = 0; s < 300; s++) if (nextCard(cards, ctx, seededRng(s)).id === 'b-l1') b++;
    expect(b).toBeLessThan(60);
  });
  it('null si todo es inseguro', () => {
    expect(nextCard([cards[0]], { careZones: ['rodilla'], now }, seededRng(1))).toBeNull();
  });
});
