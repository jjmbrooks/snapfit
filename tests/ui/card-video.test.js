// Enlace a video tutorial en el reverso (docs/training/VIDEOS.md): validación, render y privacidad.
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { initStory } from '../../src/ui/story/index.js';
import { cardHTML } from '../../src/ui/components/tcard.js';
import { videoOf, cardExtrasErrors } from '../../src/ui/card/card-data.js';

const cards = JSON.parse(readFileSync(new URL('../../content/cards/adulto-general.draft.json', import.meta.url), 'utf8'));
const base = { steps: ['Uno', 'Dos', 'Tres'], dose: { type: 'reps', reps: 10, sets: 1 } };

describe('video tutorial en la carta', () => {
  beforeAll(() => initStory('vitalia'));
  it('valida: solo YouTube https y fuente obligatoria', () => {
    expect(cardExtrasErrors({ ...base, videoUrl: 'https://www.youtube.com/watch?v=u6hh6vOgXNI', videoSource: 'FREMAP' })).toEqual([]);
    expect(cardExtrasErrors({ ...base, videoUrl: 'https://youtu.be/u6hh6vOgXNI', videoSource: 'FREMAP' })).toEqual([]);
    expect(cardExtrasErrors({ ...base, videoUrl: 'http://www.youtube.com/watch?v=u6hh6vOgXNI', videoSource: 'X' }).join()).toMatch(/videoUrl/);
    expect(cardExtrasErrors({ ...base, videoUrl: 'https://evil.example/watch?v=u6hh6vOgXNI', videoSource: 'X' }).join()).toMatch(/videoUrl/);
    expect(cardExtrasErrors({ ...base, videoUrl: 'javascript:alert(1)', videoSource: 'X' }).join()).toMatch(/videoUrl/);
    expect(cardExtrasErrors({ ...base, videoUrl: 'https://youtu.be/u6hh6vOgXNI' }).join()).toMatch(/videoSource/);
    expect(cardExtrasErrors({ ...base, videoSource: 'Sin URL' }).join()).toMatch(/videoUrl/);
  });
  it('videoOf ignora URL inválida o sin fuente', () => {
    expect(videoOf({ videoUrl: 'https://youtu.be/u6hh6vOgXNI', videoSource: ' NHS ' })).toEqual({ url: 'https://youtu.be/u6hh6vOgXNI', source: 'NHS' });
    expect(videoOf({ videoUrl: 'https://vimeo.com/1', videoSource: 'X' })).toBeNull();
    expect(videoOf({ videoUrl: 'https://youtu.be/u6hh6vOgXNI' })).toBeNull();
    expect(videoOf({})).toBeNull();
  });
  it('reverso: enlace con icono, etiqueta y fuente; pestaña nueva con rel=noopener; sin incrustar', () => {
    const squat = cards.find((c) => c.id === 'sentadilla-silla-l1');
    const h = cardHTML(squat);
    const a = h.match(/<a class="ac-video"[^>]*>/)?.[0];
    expect(a).toBeTruthy();
    expect(a).toContain(`href="${squat.videoUrl}"`);
    expect(a).toContain('target="_blank"');
    expect(a).toMatch(/rel="noopener[^"]*"/);
    expect(h).toContain('Ver video · FREMAP');
    expect(h).toContain('ac-video-ico');
    expect(h).not.toMatch(/<iframe|<video|autoplay/);
    expect(h).not.toMatch(/onclick|data-track|gtag|logEvent/);
  });
  it('carta sin video verificado no muestra nada', () => {
    const c = cards.find((x) => !x.videoUrl);
    expect(c).toBeTruthy();
    expect(cardHTML(c)).not.toContain('ac-video');
  });
  it('todas las cartas con video usan YouTube y tienen fuente; ids únicos de video por carta', () => {
    const withVideo = cards.filter((c) => c.videoUrl);
    expect(withVideo.length).toBeGreaterThanOrEqual(10);
    for (const c of withVideo) expect(videoOf(c), c.id).not.toBeNull();
  });
  it('docs/training/VIDEOS.md lista cada video de las cartas', () => {
    const doc = readFileSync(new URL('../../docs/training/VIDEOS.md', import.meta.url), 'utf8');
    for (const c of cards.filter((x) => x.videoUrl)) {
      expect(doc, c.id).toContain(c.id);
      expect(doc, c.id).toContain(c.videoUrl.split('v=')[1] || c.videoUrl.split('/').pop());
    }
  });
});
