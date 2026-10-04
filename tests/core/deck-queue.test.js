import { describe, it, expect } from 'vitest';
import { syncDeck, topCard, sendToBottom, discardTop, seededRng } from '../../src/core/index.js';

const mk = (id, group = 'core', zones = []) => ({ id, primaryGroup: group, muscleGroups: [group], level: 1, locations: ['cualquiera'], careZones: zones });
const cards = [mk('a-l1'), mk('b-l1', 'piernas'), mk('c-l1', 'empuje'), mk('d-l1', 'cardio', ['rodilla'])];
const ctx = { now: 1e12, levels: {} };

describe('deck-queue', () => {
  it('construye un mazo con todas las elegibles', () => {
    const d = syncDeck(cards, ctx, null, seededRng(1));
    expect(d.draw.sort()).toEqual(['a-l1', 'b-l1', 'c-l1', 'd-l1']);
    expect(d.discard).toEqual([]);
  });
  it('«Otro» manda la carta de arriba al fondo', () => {
    const d = { draw: ['a-l1', 'b-l1', 'c-l1'], discard: [] };
    expect(sendToBottom(d).draw).toEqual(['b-l1', 'c-l1', 'a-l1']);
    expect(topCard(sendToBottom(d))).toBe('b-l1');
  });
  it('«Listo» descarta y al vaciarse rebaraja sin repetir la última arriba', () => {
    let d = { draw: ['a-l1'], discard: ['b-l1', 'c-l1'] };
    d = discardTop(cards, ctx, d, seededRng(3));
    expect(d.discard).toEqual([]);
    expect(d.draw.sort()).toEqual(['a-l1', 'b-l1', 'c-l1']);
    for (let s = 0; s < 20; s++) {
      const r = discardTop(cards, ctx, { draw: ['a-l1'], discard: ['b-l1'] }, seededRng(s));
      expect(topCard(r)).toBe('b-l1');
    }
  });
  it('conserva el orden previo y quita cartas que dejan de ser elegibles', () => {
    const prev = { draw: ['c-l1', 'd-l1', 'a-l1'], discard: ['b-l1'] };
    const d = syncDeck(cards, { ...ctx, careZones: ['rodilla'] }, prev, seededRng(1));
    expect(d.draw).toEqual(['c-l1', 'a-l1']);
    expect(d.discard).toEqual(['b-l1']);
  });
  it('agrega cartas nuevas al final', () => {
    const d = syncDeck(cards, ctx, { draw: ['b-l1'], discard: [] }, seededRng(2));
    expect(d.draw[0]).toBe('b-l1');
    expect(d.draw).toHaveLength(4);
  });
});
