// Motor de mazo: elige la siguiente carta (docs/02-ARCHITECTURE.md §6). Puro.

/**
 * @param {Array<object>} cards
 * @param {object} ctx
 * @param {Record<string,number>} ctx.levels nivel por grupo
 * @param {string[]} [ctx.places] lugares activos (vacío = todos)
 * @param {string[]} [ctx.careZones] zonas a cuidar (excluye cartas que las listan)
 * @param {Array<{cardId:string, ts:number}>} [ctx.recent] cartas hechas recientes
 * @param {Record<string,number>} [ctx.todayGroups] conteo de grupos hoy
 * @param {Record<string,number>} [ctx.weekGroups] conteo de grupos en 7 días
 * @param {string} [ctx.excludeId] carta actual (para «Otra carta»)
 * @param {number} ctx.now ms
 * @param {() => number} rng
 * @returns {object|null}
 */
export function nextCard(cards, ctx, rng = Math.random) {
  const pool = candidatePool(cards, ctx);
  if (!pool.length) return null;
  const weights = pool.map((c) => weightFor(c, ctx));
  return weightedPick(pool, weights, rng);
}

export function candidatePool(cards, ctx) {
  const byId = new Map(cards.map((c) => [c.id, c]));
  const zones = new Set(ctx.careZones || []);
  const places = ctx.places || [];

  const safe = (c) => !(c.careZones || []).some((z) => zones.has(z));
  const placeOk = (c) => !places.length || (c.locations || []).some((l) => l === 'cualquiera' || places.includes(l));
  const lvl = (c) => ctx.levels?.[c.primaryGroup || c.muscleGroups?.[0]] ?? 1;
  const levelOk = (c) => c.level <= lvl(c) + 1 && c.level >= lvl(c) - 1;

  // Sustituye por la variante más fácil si la carta toca una zona a cuidar.
  const resolved = [];
  const seen = new Set();
  for (const c of cards) {
    let card = c;
    if (!safe(card) && card.easier && byId.has(card.easier) && safe(byId.get(card.easier))) card = byId.get(card.easier);
    if (!safe(card) || seen.has(card.id)) continue;
    seen.add(card.id);
    resolved.push(card);
  }
  const notCurrent = resolved.filter((c) => c.id !== ctx.excludeId);
  const base = notCurrent.length ? notCurrent : resolved;

  // Relajación progresiva: nivel → lugar. Nunca se relaja la seguridad.
  for (const filt of [(c) => placeOk(c) && levelOk(c), placeOk, (c) => levelOk(c), () => true]) {
    const r = base.filter(filt);
    if (r.length) return r;
  }
  return [];
}

export function weightFor(c, ctx) {
  let w = 1;
  const g = c.primaryGroup || c.muscleGroups?.[0];
  const recent = (ctx.recent || []).filter((r) => r.cardId === c.id);
  if (recent.some((r) => ctx.now - r.ts < 24 * 3600e3)) w *= 0.15;
  else if (recent.some((r) => ctx.now - r.ts < 48 * 3600e3)) w *= 0.5;
  if ((ctx.todayGroups?.[g] || 0) > 0) w *= 0.5;
  if (!(ctx.weekGroups?.[g] > 0)) w *= 2;
  if ((ctx.levels?.[g] ?? 1) === c.level) w *= 1.5;
  return w;
}

export function weightedPick(items, weights, rng) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r < 0) return items[i];
  }
  return items[items.length - 1];
}

/** PRNG con seed (mulberry32) para tests y reproducibilidad. */
export function seededRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
