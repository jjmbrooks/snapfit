// Verifica contraste WCAG AA de los 6 temas (texto normal ≥ 4.5:1).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { THEMES } from '../../src/core/index.js';

const css = readFileSync(new URL('../../src/ui/styles/themes.css', import.meta.url), 'utf8');
function themeVars(t) {
  const re = new RegExp(`\\[data-theme='${t}'\\][^{]*\\{([^}]*)\\}`);
  const body = css.match(re)[1];
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]));
}
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const PAIRS = [
  ['text', 'bg'], ['text', 'surface'], ['text', 'surface-2'], ['text-muted', 'bg'], ['text-muted', 'surface'],
  ['on-primary', 'primary'], ['on-accent', 'accent'], ['primary', 'surface'], ['accent', 'surface'],
  ['warning', 'surface'], ['danger', 'surface'], ['success', 'surface'],
];
describe('contraste AA de temas', () => {
  for (const t of THEMES) {
    it(t, () => {
      const v = themeVars(t);
      for (const [fg, bg] of PAIRS) expect(ratio(v[fg], v[bg]), `${t}: ${fg} sobre ${bg}`).toBeGreaterThanOrEqual(4.5);
    });
  }
});

const cards = readFileSync(new URL('../../src/ui/styles/cards.css', import.meta.url), 'utf8');
describe('contraste de familias de cartas', () => {
  for (const m of cards.matchAll(/\.fam-([a-z]+)\s*\{\s*--fam:\s*(#[0-9a-f]{6});\s*--fam-dark:\s*(#[0-9a-f]{6});\s*--fam-ink:\s*(#[0-9a-f]{6})/g)) {
    it(m[1], () => {
      expect(ratio(m[4], m[2]), `${m[1]}: tinta sobre color`).toBeGreaterThanOrEqual(4.5);
      expect(ratio('#ffffff', m[3]), `${m[1]}: blanco sobre oscuro`).toBeGreaterThanOrEqual(3);
    });
  }
  it('existen las 7 familias', () => expect([...cards.matchAll(/\.fam-[a-z]+\s*\{\s*--fam:/g)].length).toBe(7));
});
