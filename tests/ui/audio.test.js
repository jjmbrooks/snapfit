// Audio de historia (docs/AUDIO.md): plan puro (música por pantalla, efecto por evento, rutas del paquete),
// preferencias del dispositivo y alcance por paquete (otra historia no hereda la música de Vitalia).
import { describe, it, expect } from 'vitest';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { musicForRoute, sfxForDone, resolveAudio, normalizePrefs, channelGain, celebrates, DEFAULT_PREFS, MUSIC_KEYS, SFX_KEYS } from '../../src/ui/audio/plan.js';
import { resolveStory, PACK_ONLY_ASSETS } from '../../src/ui/story/resolve.js';
import { genericStory } from '../../src/ui/story/generic.js';
import { BADGE_IDS } from '../../src/core/index.js';

const root = new URL('../../', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const vitalia = { manifest: read('content/stories/vitalia/manifest.json'), story: read('content/stories/vitalia/story.json') };
const pixel = { manifest: read('content/stories/pixelandia/manifest.json'), story: read('content/stories/pixelandia/story.json') };
const resolve = (activeId) => resolveStory({ packs: { vitalia, pixelandia: pixel }, activeId, defaultId: 'vitalia', generic: genericStory(BADGE_IDS), badgeIds: BADGE_IDS });
const day = (todayCount, streak = 1, dailyGoal = 3) => ({ todayCount, dailyGoal, streak: { current: streak } });
const noDiff = { newBadges: [], levelChanges: [] };

describe('plan de audio', () => {
  it('música por pantalla', () => {
    expect(musicForRoute('card', { onboarding: true })).toBe('intro');
    expect(musicForRoute('profile')).toBe('intro');
    expect(musicForRoute('card')).toBe('sesion');
    expect(musicForRoute('sample')).toBe('sesion');
    for (const r of ['menu', 'progress', 'achievements', 'detail', 'privacy']) expect(musicForRoute(r)).toBe('menu');
  });
  it('efecto al completar: nivel > meta/racha > logro > listo', () => {
    const up = { newBadges: ['x'], levelChanges: [{ group: 'piernas', from: 1, to: 2 }] };
    expect(sfxForDone(day(2), day(3), up)).toBe('nivel');
    expect(sfxForDone(day(2), day(3), { newBadges: ['x'], levelChanges: [] })).toBe('meta');
    expect(sfxForDone(day(0, 1), day(1, 2), noDiff)).toBe('meta'); // racha sube a 2+
    expect(sfxForDone(day(0), day(1), { newBadges: ['x'], levelChanges: [] })).toBe('logro');
    expect(sfxForDone(day(0), day(1), noDiff)).toBe('listo');
    expect(sfxForDone(day(3), day(4), noDiff)).toBe('listo'); // meta ya cumplida antes
    expect(sfxForDone(day(0), day(1), { newBadges: [], levelChanges: [{ group: 'a', from: 3, to: 2 }] })).toBe('listo'); // bajar no se celebra
  });
  it('celebración solo en hitos', () => {
    expect(celebrates('listo')).toBe(false);
    ['nivel', 'meta', 'logro'].forEach((k) => expect(celebrates(k)).toBe(true));
  });
  it('preferencias: valores por defecto, límites y canal en silencio', () => {
    expect(normalizePrefs(null)).toEqual({ ...DEFAULT_PREFS });
    expect(normalizePrefs({ musicVol: 7, sfxVol: -1, music: false })).toMatchObject({ musicVol: 1, sfxVol: 0, music: false, sfx: true });
    expect(normalizePrefs({ musicVol: 'x' }).musicVol).toBe(DEFAULT_PREFS.musicVol);
    expect(channelGain({ muted: true }, 'sfx')).toBe(0);
    expect(channelGain({ music: false }, 'music')).toBe(0);
    expect(channelGain({ sfxVol: 0.5 }, 'sfx')).toBe(0.5);
  });
  it('rutas: base + paquete, y .mp3 hermano si el navegador no decodifica OGG', () => {
    const { assets } = resolve('vitalia');
    expect(resolveAudio(assets, 'music', 'menu', { base: '/snapfit/' })).toBe('/snapfit/stories/vitalia/audio/musica-menu.ogg');
    expect(resolveAudio(assets, 'sfx', 'flip', { base: '/', canOgg: false })).toBe('/stories/vitalia/audio/sfx-flip.mp3');
    expect(resolveAudio(assets, 'sfx', 'nada')).toBeNull();
    expect(assets.audio.formats).toEqual(['ogg', 'mp3']);
  });
});

describe('paquete de audio de Vitalia', () => {
  const a = vitalia.manifest.assets.audio;
  it('cubre todas las pantallas y eventos', () => {
    expect(Object.keys(a.music).sort()).toEqual([...MUSIC_KEYS].sort());
    expect(Object.keys(a.sfx).sort()).toEqual([...SFX_KEYS].sort());
  });
  it('archivos pequeños (música < 600 KB, efectos < 40 KB), en ambos formatos, documentados', () => {
    const doc = readFileSync(new URL('docs/AUDIO.md', root), 'utf8');
    const notice = readFileSync(new URL('NOTICE.md', root), 'utf8');
    for (const [kind, max] of [['music', 600_000], ['sfx', 40_000]]) {
      for (const p of Object.values(a[kind])) {
        for (const fmt of a.formats) {
          const f = `public/stories/vitalia/${p.replace(/\.ogg$/, `.${fmt}`)}`;
          expect(existsSync(new URL(f, root)), f).toBe(true);
          expect(statSync(new URL(f, root)).size, f).toBeLessThan(max);
          expect(doc.includes(f.split('/').pop()), `docs/AUDIO.md menciona ${f}`).toBe(true);
        }
      }
    }
    for (const c of vitalia.manifest.credits.filter((x) => x.license === 'CC BY 4.0')) expect(notice.includes(c.title), `NOTICE.md acredita ${c.title}`).toBe(true);
  });
  it('es identidad del paquete: otra historia no hereda la música ni los efectos de Vitalia', () => {
    expect(PACK_ONLY_ASSETS).toContain('audio');
    expect(resolve('pixelandia').assets.audio).toBeUndefined();
    expect(resolve('vitalia').assets.audio.music.intro).toBe('stories/vitalia/audio/musica-intro.ogg');
  });
});
