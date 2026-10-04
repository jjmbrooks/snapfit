// Carta arcade (estilo C): estructura del frente/reverso, rangos compartiendo marco y fallback de assets.
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { initStory } from '../../src/ui/story/index.js';
import { cardHTML } from '../../src/ui/components/tcard.js';

const cards = JSON.parse(readFileSync(new URL('../../content/cards/adulto-general.draft.json', import.meta.url), 'utf8'));
const squat = cards.find((c) => c.id === 'sentadilla-silla-l1');
const push = cards.find((c) => c.id === 'flexion-pared-l1');

describe('carta arcade', () => {
  beforeAll(() => initStory('vitalia'));
  it('frente: gema con nivel, estandarte, emblema, ventana, pergamino y escudo de XP', () => {
    const h = cardHTML(squat);
    for (const cls of ['ac-gem', 'ac-banner', 'ac-emblem', 'ac-window', 'ac-parch', 'ac-xp']) expect(h).toContain(cls);
    expect(h).toContain('Aprendiz · Escuela de la Raíz');
    expect(h).toContain('/art/vitalia/cards/sentadilla-silla-l1.jpg');
    expect(h).toMatch(/class="ac-xp"[^>]*><b>10<\/b>/);
  });
  it('los 4 rangos comparten marco: solo cambia la clase de rango, el nombre y la XP', () => {
    const expected = { 1: ['tier-1 rank-bronce', 'Aprendiz', 10], 4: ['tier-2 rank-plata', 'Adepto', 40], 7: ['tier-3 rank-oro', 'Magister', 70], 10: ['tier-4 rank-gema', 'Archimago', 100] };
    for (const [lvl, [cls, rank, xp]] of Object.entries(expected)) {
      const h = cardHTML(squat, { level: Number(lvl) });
      expect(h).toContain(cls);
      expect(h).toContain(`${rank} · Escuela de la Raíz`);
      expect(h).toContain(`<b>${xp}</b>`);
      expect(h).toContain(`<b>${lvl}</b>`);
    }
  });
  it('reverso: título del paquete, 3 pasos con pose del paquete, dosis + respiración, cuidados', () => {
    const h = cardHTML(squat);
    expect(h).toContain('Cómo lanzar el hechizo');
    expect((h.match(/class="ac-step"/g) || []).length).toBe(3);
    expect(h).toContain('/art/vitalia/poses/sentadilla-silla-l1-2.webp');
    expect(h).toContain('Exhala al subir');
    expect(h).toContain('ac-care');
    expect(h).not.toContain('<video');
  });
  it('sin assets: animación genérica, emblema SVG y ranura de pose vacía; respiración por defecto del paquete', () => {
    const h = cardHTML(push);
    expect(h).toContain('data-sprite="front"');
    expect(h).toContain('em-svg');
    expect(h).toContain('ac-pose empty');
    expect(h).toContain('Respira con el gesto');
    expect(h).toContain('Tu palma enciende la pared'); // cardFlavor del paquete
  });
  it('otro paquete: mismo marco, textos neutros del paquete', async () => {
    await initStory('pixelandia');
    const h = cardHTML(squat);
    expect(h).toContain('Cómo se hace');
    expect(h).not.toContain('/art/vitalia/');
    await initStory('vitalia');
  });
});
