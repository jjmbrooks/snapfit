// Los borradores de content/drafts/ no entran al mazo ni mueven el límite de nivel hasta que Entrenador los valide.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { levelCaps } from '../../src/core/index.js';
import cards from '../../content/cards/adulto-general.draft.json';
import deck from '../../content/decks/adulto-general.json';
import drafts from '../../content/drafts/escalera-l2-l6.json';

describe('borradores de la escalera (content/drafts)', () => {
  it('todos son draft y published: false', () => {
    expect(drafts.length).toBeGreaterThan(0);
    for (const c of drafts) expect({ id: c.id, draft: c.draft, published: c.published }).toEqual({ id: c.id, draft: true, published: false });
  });
  it('ninguno está en el mazo ni en content/cards', () => {
    const ids = new Set([...deck.cards, ...cards.map((c) => c.id)]);
    for (const c of drafts) expect(ids.has(c.id), c.id).toBe(false);
  });
  it('la app no importa content/drafts', () => {
    const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]));
    for (const f of walk('src').filter((x) => x.endsWith('.js'))) expect(/(from|import\()\s*['"][^'"]*content\/drafts/.test(readFileSync(f, 'utf8')), f).toBe(false);
  });
  it('no suben el límite de nivel aunque se mezclen con las publicadas', () => {
    expect(levelCaps([...cards, ...drafts])).toEqual(levelCaps(cards));
  });
  it('cubren los 7 grupos en los niveles 2 a 6', () => {
    const groups = ['piernas', 'gluteos', 'empuje', 'traccion', 'core', 'movilidad', 'cardio'];
    for (const g of groups) for (const lv of [2, 3, 4, 5, 6]) {
      const has = drafts.some((c) => c.primaryGroup === g && c.level === lv) || cards.some((c) => c.primaryGroup === g && c.level === lv);
      expect(has, `${g} nv ${lv}`).toBe(true);
    }
  });
});
