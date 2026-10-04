// Contrato del copy de interfaz (content/copy/es.json). Lo editan otros modelos en paralelo (docs/PARALLEL-WORK.md),
// así que este test es la red de seguridad. Los paquetes de historia se validan en story-packs.test.js.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { MUSCLE_GROUPS, PLACES, CARE_ZONES, EFFORTS, THEMES, QUICK_TEST, SEXES, FITNESS } from '../../src/core/index.js';
import { t, COPY } from '../../src/ui/i18n/es.js';

const nonEmpty = (s) => typeof s === 'string' && s.trim().length > 0;

describe('copy de interfaz (content/copy/es.json)', () => {
  const N = COPY.names;
  it('nombres para todos los enums del core', () => {
    MUSCLE_GROUPS.forEach((k) => expect(nonEmpty(N.groups[k]), `groups.${k}`).toBe(true));
    PLACES.forEach((k) => expect(nonEmpty(N.places[k]), `places.${k}`).toBe(true));
    CARE_ZONES.forEach((k) => expect(nonEmpty(N.zones[k]), `zones.${k}`).toBe(true));
    EFFORTS.forEach((k) => expect(nonEmpty(N.effort[k]), `effort.${k}`).toBe(true));
    THEMES.forEach((k) => expect(nonEmpty(N.themes[k]), `themes.${k}`).toBe(true));
    SEXES.forEach((k) => expect(nonEmpty(N.sexes[k]), `sexes.${k}`).toBe(true));
    FITNESS.forEach((k) => expect(nonEmpty(N.fitness[k]?.name) && nonEmpty(N.fitness[k]?.desc), `fitness.${k}`).toBe(true));
  });
  it('prueba rápida: pregunta y 3 opciones por id del core', () => {
    for (const q of QUICK_TEST) {
      expect(nonEmpty(COPY.quickTest[q.id]?.question), q.id).toBe(true);
      expect(COPY.quickTest[q.id].options).toHaveLength(3);
    }
  });
  it('t() interpola y devuelve la clave si falta', () => {
    expect(t('reward.xp', { n: 10 })).toBe('+10 XP');
    expect(t('no.existe')).toBe('no.existe');
  });
  it('toda clave t(\'…\') usada en src/ existe', () => {
    const files = [];
    const walk = (u) => readdirSync(u, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(new URL(e.name + '/', u)) : e.name.endsWith('.js') && files.push(new URL(e.name, u))));
    walk(new URL('../../src/ui/', import.meta.url));
    const missing = [];
    for (const f of files) {
      for (const m of readFileSync(f, 'utf8').matchAll(/\bt\('([\w.-]+)'/g)) if (!m[1].endsWith('.') && t(m[1]) === m[1]) missing.push(`${f.pathname.split('/src/')[1]}: ${m[1]}`);
    }
    expect(missing).toEqual([]);
  });
});
