// Contrato de los archivos de copy e historia: los editan otros modelos en paralelo (docs/PARALLEL-WORK.md),
// así que este test es la red de seguridad. Si agregas una historia nueva en content/story/<id>.json, se valida sola.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { MUSCLE_GROUPS, PLACES, CARE_ZONES, EFFORTS, THEMES, BADGE_IDS, QUICK_TEST, SEXES, FITNESS } from '../../src/core/index.js';
import { t, COPY } from '../../src/ui/i18n/es.js';

const dir = new URL('../../content/story/', import.meta.url);
const active = JSON.parse(readFileSync(new URL('active.json', dir), 'utf8')).active;
const stories = readdirSync(dir).filter((f) => f.endsWith('.json') && f !== 'active.json')
  .map((f) => [f.replace('.json', ''), JSON.parse(readFileSync(new URL(f, dir), 'utf8'))]);
const nonEmpty = (s) => typeof s === 'string' && s.trim().length > 0;

describe('historias (content/story/*.json)', () => {
  it('la historia activa existe', () => expect(stories.map(([id]) => id)).toContain(active));
  for (const [id, s] of stories) {
    describe(id, () => {
      it('id coincide con el nombre del archivo', () => expect(s.id).toBe(id));
      it('bienvenida, login y mazo listo completos', () => {
        expect(nonEmpty(s.title)).toBe(true);
        expect(s.welcome.lines.length).toBeGreaterThanOrEqual(1);
        expect(s.welcome.lines.length).toBeLessThanOrEqual(5);
        s.welcome.lines.forEach((l) => expect(nonEmpty(l)).toBe(true));
        expect(nonEmpty(s.welcome.cta)).toBe(true);
        expect(s.welcome.cta.length).toBeLessThanOrEqual(28); // cabe en un botón a 390 px
        ['title', 'body', 'offline'].forEach((k) => expect(nonEmpty(s.signin[k]), `signin.${k}`).toBe(true));
        expect(nonEmpty(s.deckReady.title)).toBe(true);
      });
      it('una familia por grupo muscular, con nombre e ícono', () => {
        for (const g of MUSCLE_GROUPS) {
          expect(nonEmpty(s.families[g]?.name), `families.${g}.name`).toBe(true);
          expect(nonEmpty(s.families[g]?.icon), `families.${g}.icon`).toBe(true);
        }
      });
      it('tiers 1–4', () => [1, 2, 3, 4].forEach((n) => expect(nonEmpty(s.tiers[n]), `tiers.${n}`).toBe(true)));
      it('recompensas y recordatorios', () => {
        expect(s.rewards.length).toBeGreaterThan(0);
        expect(s.reminders.length).toBeGreaterThan(0);
      });
      it('nombre y descripción para cada insignia del core', () => {
        for (const b of BADGE_IDS) {
          expect(nonEmpty(s.badges[b]?.name), `badges.${b}.name`).toBe(true);
          expect(nonEmpty(s.badges[b]?.desc), `badges.${b}.desc`).toBe(true);
        }
      });
    });
  }
});

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
