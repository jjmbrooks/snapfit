import { describe, it, expect } from 'vitest';
import { slotsFor, dueReminder } from '../../src/core/index.js';
const TZ = -360;
const at = (hhmm, day = '2026-10-03') => Date.parse(`${day}T${hhmm}:00-06:00`);

describe('schedule', () => {
  it('presets y custom', () => {
    expect(slotsFor('manana')).toEqual(['09:00']);
    expect(slotsFor('off')).toEqual([]);
    expect(slotsFor('custom', ['18:30', 'xx', '07:05'])).toEqual(['07:05', '18:30']);
  });
  it('vence después de la hora y antes de la ventana', () => {
    expect(dueReminder({ now: at('08:59'), tzOffsetMin: TZ, slots: ['09:00'] })).toBeNull();
    expect(dueReminder({ now: at('09:10'), tzOffsetMin: TZ, slots: ['09:00'] })).toBe('2026-10-03@09:00');
    expect(dueReminder({ now: at('13:00'), tzOffsetMin: TZ, slots: ['09:00'] })).toBeNull();
  });
  it('no vence si ya hubo carta o ya se notificó', () => {
    expect(dueReminder({ now: at('09:30'), tzOffsetMin: TZ, slots: ['09:00'], lastDoneTs: at('09:05') })).toBeNull();
    expect(dueReminder({ now: at('09:30'), tzOffsetMin: TZ, slots: ['09:00'], lastDoneTs: at('08:00') })).toBe('2026-10-03@09:00');
    expect(dueReminder({ now: at('09:30'), tzOffsetMin: TZ, slots: ['09:00'], notified: ['2026-10-03@09:00'] })).toBeNull();
  });
});
