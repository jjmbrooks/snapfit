// Mazo físico: pila de robo + descarte (docs/01-PRODUCT.md §1). Puro e inmutable.
// «Otro» manda la carta de arriba al fondo; «Listo» la descarta; al vaciarse se rebaraja el descarte.
import { candidatePool, weightFor, weightedPick } from './deck-engine.js';

/** Barajado ponderado (sin reemplazo) de los ids elegibles. */
export function shuffleWeighted(cards, ctx, rng) {
  const pool = [...cards];
  const out = [];
  while (pool.length) {
    const weights = pool.map((c) => weightFor(c, ctx));
    const pick = weightedPick(pool, weights, rng);
    out.push(pick.id);
    pool.splice(pool.indexOf(pick), 1);
  }
  return out;
}

/**
 * Construye o repara el mazo conservando el orden previo de las cartas que siguen siendo elegibles.
 * @param {object[]} cards todas las cartas
 * @param {object} ctx contexto de deck-engine (levels, places, careZones, recent, …)
 * @param {{draw:string[], discard:string[]}|null} prev
 * @param {() => number} rng
 */
export function syncDeck(cards, ctx, prev, rng) {
  const eligible = candidatePool(cards, { ...ctx, excludeId: undefined });
  const ids = new Set(eligible.map((c) => c.id));
  const draw = (prev?.draw || []).filter((id) => ids.has(id));
  const discard = (prev?.discard || []).filter((id) => ids.has(id) && !draw.includes(id));
  const known = new Set([...draw, ...discard]);
  const fresh = eligible.filter((c) => !known.has(c.id));
  const deck = { draw: [...draw, ...shuffleWeighted(fresh, ctx, rng)], discard };
  return deck.draw.length ? deck : reshuffle(cards, ctx, deck, rng);
}

export function topCard(deck) {
  return deck.draw[0] ?? null;
}

/** «Otro»: la carta de arriba pasa al fondo del mazo. */
export function sendToBottom(deck) {
  if (deck.draw.length < 2) return deck;
  const [top, ...rest] = deck.draw;
  return { ...deck, draw: [...rest, top] };
}

/** «Listo»: la carta de arriba va al descarte; si el mazo se vacía, se rebaraja. */
export function discardTop(cards, ctx, deck, rng) {
  if (!deck.draw.length) return deck;
  const [top, ...rest] = deck.draw;
  const next = { draw: rest, discard: [...deck.discard, top] };
  return next.draw.length ? next : reshuffle(cards, ctx, next, rng, top);
}

/** Rebaraja el descarte; evita que la última carta hecha quede arriba. */
export function reshuffle(cards, ctx, deck, rng, avoidTopId) {
  const byId = new Map(cards.map((c) => [c.id, c]));
  const pool = deck.discard.map((id) => byId.get(id)).filter(Boolean);
  const order = shuffleWeighted(pool, ctx, rng);
  if (order.length > 1 && order[0] === avoidTopId) order.push(order.shift());
  return { draw: [...deck.draw, ...order], discard: [] };
}
