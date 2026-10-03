// Registro de eventos solo-anexar (docs/02-ARCHITECTURE.md §3).
import { EFFORTS } from './constants.js';

export const EVENT_VERSION = 1;
export const EVENT_TYPES = ['card_done', 'card_skipped', 'effort_rated', 'level_changed', 'badge_unlocked', 'settings_changed'];

const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/** ULID (26 chars, ordenable por tiempo). rng inyectable para tests. */
export function ulid(nowMs, rng = Math.random) {
  let t = nowMs;
  let time = '';
  for (let i = 0; i < 10; i++) {
    time = CROCKFORD[t % 32] + time;
    t = Math.floor(t / 32);
  }
  let rand = '';
  for (let i = 0; i < 16; i++) rand += CROCKFORD[Math.floor(rng() * 32)];
  return time + rand;
}

/**
 * Crea un evento inmutable.
 * @param {string} type
 * @param {object} payload campos extra (cardId, level, groups, effort, refId, place…)
 * @param {{now:number, tzOffsetMin:number, rng?:()=>number, device?:string}} ctx
 */
export function makeEvent(type, payload, ctx) {
  const e = {
    id: ulid(ctx.now, ctx.rng),
    type,
    ts: new Date(ctx.now).toISOString(),
    tzOffsetMin: ctx.tzOffsetMin ?? 0,
    device: ctx.device ?? 'pwa',
    v: EVENT_VERSION,
    ...payload,
  };
  const err = validateEvent(e);
  if (err) throw new Error(err);
  return e;
}

/** Devuelve null si es válido o un mensaje de error. */
export function validateEvent(e) {
  if (!e || typeof e !== 'object') return 'evento vacío';
  if (typeof e.id !== 'string' || e.id.length !== 26) return 'id inválido';
  if (!EVENT_TYPES.includes(e.type)) return `tipo inválido: ${e.type}`;
  if (Number.isNaN(Date.parse(e.ts))) return 'ts inválido';
  if (!Number.isInteger(e.v)) return 'v inválido';
  if ((e.type === 'card_done' || e.type === 'card_skipped') && typeof e.cardId !== 'string') return 'cardId requerido';
  if (e.type === 'effort_rated' && (!EFFORTS.includes(e.effort) || typeof e.refId !== 'string')) return 'effort/refId inválidos';
  return null;
}

/** Une dos listas de eventos por id (idempotente) y ordena por id (≈ tiempo). */
export function mergeEvents(a, b) {
  const map = new Map();
  for (const e of a) map.set(e.id, e);
  for (const e of b) if (!map.has(e.id)) map.set(e.id, e);
  return [...map.values()].sort((x, y) => (x.id < y.id ? -1 : x.id > y.id ? 1 : 0));
}
