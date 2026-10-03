// Exportación e importación de progreso (JSON/CSV). Puro.
import { validateEvent, mergeEvents } from './events.js';

export const EXPORT_FORMAT = 'snapfit-export';

export function buildExport({ events, profile, now, appVersion }) {
  return {
    format: EXPORT_FORMAT,
    formatVersion: 1,
    exportedAt: new Date(now).toISOString(),
    appVersion,
    profile,
    events: events.map(stripLocal),
  };
}

export function stripLocal(e) {
  const { synced, ...rest } = e;
  return rest;
}

export function eventsToCsv(events) {
  const cols = ['id', 'type', 'ts', 'tzOffsetMin', 'cardId', 'level', 'groups', 'effort', 'refId', 'place', 'deckId'];
  const esc = (v) => {
    if (v == null) return '';
    const s = Array.isArray(v) ? v.join('|') : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...events.map((e) => cols.map((c) => esc(e[c])).join(','))].join('\n') + '\n';
}

/** Valida e integra un export. Devuelve { merged, added, rejected }. */
export function importExport(current, data) {
  if (!data || data.format !== EXPORT_FORMAT || !Array.isArray(data.events)) throw new Error('Archivo no es un export de SnapFit');
  const valid = [];
  let rejected = 0;
  for (const e of data.events) (validateEvent(e) ? rejected++ : valid.push(e));
  const ids = new Set(current.map((e) => e.id));
  const added = valid.filter((e) => !ids.has(e.id));
  return { merged: mergeEvents(current, valid), added, rejected };
}
