import { describe, it, expect } from 'vitest';
import { ulid, makeEvent, validateEvent, mergeEvents, seededRng } from '../../src/core/index.js';

describe('events', () => {
  it('ulid tiene 26 chars y ordena por tiempo', () => {
    const r = seededRng(1);
    const a = ulid(1000, r), b = ulid(2000, r);
    expect(a).toHaveLength(26);
    expect(a < b).toBe(true);
  });
  it('makeEvent valida', () => {
    const e = makeEvent('card_done', { cardId: 'x', groups: ['core'] }, { now: 1e12, tzOffsetMin: -360 });
    expect(validateEvent(e)).toBeNull();
    expect(() => makeEvent('nope', {}, { now: 1 })).toThrow();
    expect(() => makeEvent('card_done', {}, { now: 1 })).toThrow();
  });
  it('mergeEvents es idempotente', () => {
    const e1 = makeEvent('card_done', { cardId: 'a' }, { now: 1e12 });
    const e2 = makeEvent('card_done', { cardId: 'b' }, { now: 1e12 + 5 });
    const m = mergeEvents([e1], [e1, e2]);
    expect(m.map((e) => e.id)).toEqual([e1.id, e2.id]);
    expect(mergeEvents(m, m)).toHaveLength(2);
  });
});
