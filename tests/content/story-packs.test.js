// Paquetes de historia (content/stories/<id>/): validación de cada paquete, fallback y,
// sobre todo, INDEPENDENCIA: la historia no toca la mecánica ni el progreso (ADR-011).
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { BADGE_IDS, MUSCLE_GROUPS, deriveState } from '../../src/core/index.js';
import { validatePack, resolveStory, deepMerge } from '../../src/ui/story/resolve.js';
import { genericStory } from '../../src/ui/story/generic.js';
import leveling from '../../content/leveling.json';
import { done, rate, NOW, TZ } from '../core/helpers.js';

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const root = new URL('../../', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const ids = readdirSync(new URL('content/stories/', root)).filter((d) => statSync(new URL(`content/stories/${d}`, root)).isDirectory());
const packs = Object.fromEntries(ids.map((id) => [id, { manifest: read(`content/stories/${id}/manifest.json`), story: read(`content/stories/${id}/story.json`) }]));
const DEFAULT = read('content/stories/index.json').default;
const GENERIC = genericStory(BADGE_IDS);
const cardIds = new Set([].concat(read('content/cards/adulto-general.draft.json').cards ?? read('content/cards/adulto-general.draft.json')).map((c) => c.id));
const provenance = readFileSync(new URL('docs/ASSETS-PROVENANCE.md', root), 'utf8');

describe('paquetes de historia instalados', () => {
  it('hay al menos 2 paquetes y existe el por defecto', () => {
    expect(ids.length).toBeGreaterThanOrEqual(2);
    expect(ids).toContain(DEFAULT);
  });
  for (const id of ids) {
    describe(id, () => {
      const { manifest, story } = packs[id];
      it('pasa el schema (manifest + story) y cubre todas las insignias', () => {
        expect(validatePack(packs[id], { badgeIds: BADGE_IDS })).toEqual([]);
      });
      it('id = carpeta', () => { expect(manifest.id).toBe(id); expect(story.id).toBe(id); });
      it('una familia por grupo muscular estable (y nada más)', () => {
        expect(Object.keys(story.families).sort()).toEqual([...MUSCLE_GROUPS].sort());
      });
      it('insignias: exactamente los ids del core', () => {
        expect(Object.keys(story.badges).sort()).toEqual([...BADGE_IDS].sort());
      });
      it('textos de botón y etiquetas caben a 390 px', () => {
        expect(story.welcome.cta.length).toBeLessThanOrEqual(28);
        story.rewards.forEach((r) => expect(r.length, r).toBeLessThanOrEqual(28));
        Object.values(story.tiers).forEach((r) => expect(r.length, r).toBeLessThanOrEqual(16));
        Object.values(story.families).forEach((f) => expect(f.name.length, f.name).toBeLessThanOrEqual(28));
        Object.values(story.badges).forEach((b) => expect(b.name.length, b.name).toBeLessThanOrEqual(32));
      });
      it('regiones para los niveles 1–10', () => {
        for (let n = 1; n <= 10; n++) expect(story.regions[n], `regions.${n}`).toBeTruthy();
      });
      it('cada asset existe (public/stories/<id>/ o public/art/…) y tiene fila de procedencia', () => {
        const files = [];
        const walk = (o) => Object.entries(o || {}).forEach(([k, v]) => (k === 'tokens' ? null : typeof v === 'string' ? files.push(v) : walk(v)));
        walk(manifest.assets);
        if (manifest.preview) files.push(manifest.preview);
        for (const f of files) {
          const p = f.startsWith('/') ? `public${f}` : `public/stories/${id}/${f}`;
          expect(existsSync(new URL(p, root)), p).toBe(true);
          expect(provenance.includes(p), `procedencia de ${p}`).toBe(true);
        }
      });
      it('el arte de carta apunta a ids de carta existentes', () => {
        for (const cid of Object.keys(manifest.assets?.cardArt || {})) expect(cardIds.has(cid), cid).toBe(true);
        for (const cid of Object.keys(manifest.assets?.poses || {})) expect(cardIds.has(cid), `poses.${cid}`).toBe(true);
        for (const cid of Object.keys(story.cardFlavor || {})) expect(cardIds.has(cid), `cardFlavor.${cid}`).toBe(true);
      });
      it('si sobreescribe colores del tema, mantiene contraste AA sobre su tema por defecto', () => {
        const tok = manifest.assets?.tokens || {};
        const css = readFileSync(new URL('src/ui/styles/tokens.css', root), 'utf8');
        const body = css.match(new RegExp(`\\[data-theme='${manifest.defaultTheme}'\\][^{]*\\{([^}]*)\\}`))[1];
        const v = { ...Object.fromEntries([...body.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]])), ...Object.fromEntries(Object.entries(tok).map(([k, x]) => [k.slice(2), x])) };
        if ('--primary' in tok || '--on-primary' in tok) expect(ratio(v['on-primary'], v.primary)).toBeGreaterThanOrEqual(4.5);
        if ('--accent' in tok || '--on-accent' in tok) expect(ratio(v['on-accent'], v.accent)).toBeGreaterThanOrEqual(4.5);
        if ('--story-accent' in tok) expect(ratio(tok['--story-accent'], v.surface ?? v.bg)).toBeGreaterThanOrEqual(4.5);
      });
    });
  }
});

describe('resolver: cadena de fallback paquete → por defecto → genérica', () => {
  const other = ids.find((i) => i !== DEFAULT);
  it('usa el paquete activo', () => {
    const r = resolveStory({ packs, activeId: other, defaultId: DEFAULT, generic: GENERIC, badgeIds: BADGE_IDS });
    expect(r.id).toBe(other);
    expect(r.story.title).toBe(packs[other].story.title);
  });
  it('paquete inválido → por defecto (y reporta errores)', () => {
    const broken = { ...packs, roto: { manifest: { ...packs[other].manifest, id: 'roto' }, story: { id: 'roto', title: '' } } };
    const r = resolveStory({ packs: broken, activeId: 'roto', defaultId: DEFAULT, generic: GENERIC, badgeIds: BADGE_IDS });
    expect(r.id).toBe(DEFAULT);
    expect(r.errors.roto.length).toBeGreaterThan(0);
  });
  it('id inexistente → por defecto', () => {
    expect(resolveStory({ packs, activeId: 'no-existe', defaultId: DEFAULT, generic: GENERIC }).id).toBe(DEFAULT);
  });
  it('sin paquetes → genérica completa', () => {
    const r = resolveStory({ packs: {}, activeId: 'x', defaultId: 'y', generic: GENERIC, badgeIds: BADGE_IDS });
    expect(r.id).toBe('generic');
    for (const b of BADGE_IDS) expect(r.story.badges[b]).toBeTruthy();
  });
  it('fusión por campo: lo que falta en un nivel se toma del anterior', () => {
    const m = deepMerge({ a: { x: 1, y: 2 }, l: [1] }, { a: { y: 3 }, l: [9] });
    expect(m).toEqual({ a: { x: 1, y: 3 }, l: [9] });
  });
  it('assets con ruta pública y fallback al paquete por defecto', () => {
    const r = resolveStory({ packs, activeId: 'valle-gremios', defaultId: DEFAULT, generic: GENERIC, badgeIds: BADGE_IDS });
    for (const v of Object.values(r.assets.cardArt || {})) expect(v.startsWith('stories/valle-gremios/')).toBe(true);
  });
  it('arte, poses y ambientación por carta NO se heredan del paquete por defecto', () => {
    const r = resolveStory({ packs, activeId: 'pixelandia', defaultId: 'vitalia', generic: GENERIC, badgeIds: BADGE_IDS });
    expect(r.assets.cardArt || {}).toEqual({});
    expect(r.assets.poses || {}).toEqual({});
    expect(r.story.cardFlavor).toBeUndefined();
    expect(r.story.cardBack).toBeUndefined();
    const v = resolveStory({ packs, activeId: 'vitalia', defaultId: 'vitalia', generic: GENERIC, badgeIds: BADGE_IDS });
    expect(v.assets.cardArt['sentadilla-silla-l1']).toBe('art/vitalia/cards/sentadilla-silla-l1.jpg');
    expect(v.assets.poses['sentadilla-silla-l1']).toHaveLength(3);
  });
});

describe('independencia historia ↔ mecánica/progreso (ADR-011)', () => {
  it('src/core y src/adapters no importan historia, copy ni UI', () => {
    for (const dir of ['src/core/', 'src/adapters/', 'src/adapters/firebase/']) {
      for (const f of readdirSync(new URL(dir, root)).filter((x) => x.endsWith('.js'))) {
        const src = readFileSync(new URL(dir + f, root), 'utf8');
        expect(src, `${dir}${f}`).not.toMatch(/from ['"][^'"]*(content\/stor|content\/copy|ui\/story|ui\/i18n|\/ui\/)/);
      }
    }
  });
  it('cambiar de historia no cambia el progreso derivado', () => {
    const e1 = done(-2, { cardId: 'sentadilla-silla-l1', groups: ['piernas', 'gluteos'] });
    const events = [e1, rate(e1, 'bien'), done(-1, { cardId: 'flexion-pared-l1', groups: ['empuje'] }), done(0, { cardId: 'marcha-sitio-l1', groups: ['cardio'], hour: 7 })];
    const opts = { now: NOW, tzOffsetMin: TZ, dailyGoal: 3, leveling };
    const results = ids.map((id) => {
      resolveStory({ packs, activeId: id, defaultId: DEFAULT, generic: GENERIC, badgeIds: BADGE_IDS }); // activar paquete
      return JSON.stringify(deriveState(events, opts));
    });
    expect(new Set(results).size).toBe(1);
  });
  it('ni eventos ni progreso derivado contienen textos de ninguna historia', () => {
    const e1 = done(0, { cardId: 'sentadilla-silla-l1', groups: ['piernas'] });
    const blob = JSON.stringify([e1, deriveState([e1], { now: NOW, tzOffsetMin: TZ, dailyGoal: 3, leveling })]);
    for (const { story } of Object.values(packs)) {
      const texts = [story.title, ...Object.values(story.families).map((f) => f.name), ...Object.values(story.tiers), ...Object.values(story.badges).map((b) => b.name), ...Object.values(story.regions)];
      for (const t of texts) expect(blob.includes(t), t).toBe(false);
    }
  });
  it('el perfil guardado solo lleva el id de la historia', () => {
    const app = readFileSync(new URL('src/ui/app.js', root), 'utf8');
    expect(app).toMatch(/storyId: null/);
    expect(app).not.toMatch(/content\/stor/);
  });
});
