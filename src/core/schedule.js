// Recordatorios: cálculo puro del patrón (docs/02-ARCHITECTURE.md §8).
import { dayKey, localMinutes, toMs } from './time.js';

export const REMINDER_PRESETS = {
  manana: ['09:00'],
  tarde: ['16:00'],
  noche: ['20:00'],
};
export const REMINDER_PATTERNS = ['off', 'manana', 'tarde', 'noche', 'manana-tarde-noche', 'custom'];

export function slotsFor(pattern, customTimes = []) {
  if (pattern === 'off') return [];
  if (pattern === 'custom') return [...new Set(customTimes.filter(isHHMM))].sort();
  if (pattern === 'manana-tarde-noche') return ['09:00', '16:00', '20:00'];
  return REMINDER_PRESETS[pattern] || [];
}

export function isHHMM(s) {
  return typeof s === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
}

export function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Devuelve la clave del recordatorio vencido ('YYYY-MM-DD@HH:MM') o null.
 * Vence si ya pasó la hora (máx. windowMin después), no hubo carta desde esa hora hoy
 * y no se notificó antes.
 */
export function dueReminder({ now, tzOffsetMin, slots, lastDoneTs, notified = [], windowMin = 180 }) {
  const today = dayKey(now, tzOffsetMin);
  const nowMin = localMinutes(now, tzOffsetMin);
  for (const s of [...slots].sort().reverse()) {
    const sm = toMinutes(s);
    if (nowMin < sm || nowMin - sm > windowMin) continue;
    const key = `${today}@${s}`;
    if (notified.includes(key)) return null;
    if (lastDoneTs != null) {
      const ld = toMs(lastDoneTs);
      if (dayKey(ld, tzOffsetMin) === today && localMinutes(ld, tzOffsetMin) >= sm) return null;
    }
    return key;
  }
  return null;
}
