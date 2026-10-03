// Utilidades de fecha puras. tzOffsetMin = minutos a sumar a UTC para hora local (UTC-6 → -360).
const DAY_MS = 86400000;

export function localDate(tsMs, tzOffsetMin = 0) {
  return new Date(tsMs + tzOffsetMin * 60000);
}

/** 'YYYY-MM-DD' en hora local. */
export function dayKey(tsMs, tzOffsetMin = 0) {
  return localDate(tsMs, tzOffsetMin).toISOString().slice(0, 10);
}

/** Hora local 0–23. */
export function localHour(tsMs, tzOffsetMin = 0) {
  return localDate(tsMs, tzOffsetMin).getUTCHours();
}

/** Minutos desde medianoche local. */
export function localMinutes(tsMs, tzOffsetMin = 0) {
  const d = localDate(tsMs, tzOffsetMin);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

export function dayIndex(key) {
  return Math.floor(Date.parse(key + 'T00:00:00Z') / DAY_MS);
}

export function keyFromIndex(idx) {
  return new Date(idx * DAY_MS).toISOString().slice(0, 10);
}

export function addDays(key, n) {
  return keyFromIndex(dayIndex(key) + n);
}

/** Índice de semana con lunes como inicio (1970-01-01 fue jueves). */
export function weekIndex(key) {
  return Math.floor((dayIndex(key) + 3) / 7);
}

export function toMs(ts) {
  return typeof ts === 'number' ? ts : Date.parse(ts);
}
