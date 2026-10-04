// Carta estilo «carta de personaje»: marco por familia (grupo muscular) y nivel; volteo 3D al tocar.
// El arte final (ilustración + video) llegará de director-creativo; mientras, animación generada por código.
import { esc } from '../dom.js';
import { GROUP_NAMES, PLACE_NAMES, ZONE_NAMES, FAMILY_ICONS, TIER_NAMES } from '../i18n/es.js';
import { mountSprite } from './sprite.js';

export function doseLabel(c) {
  const d = c.dose || {};
  if (d.type === 'reps') return `${d.reps} reps${d.perSide ? ' / lado' : ''}`;
  if (d.type === 'hold') return `${d.durationSec} s sostén`;
  return `${d.durationSec} s`;
}

export const tierOf = (level) => (level >= 10 ? 4 : level >= 7 ? 3 : level >= 4 ? 2 : 1);

function pips(level) {
  return Array.from({ length: 10 }, (_, i) => `<i class="${i < level ? 'on' : ''}"></i>`).join('');
}

/** HTML de la carta (anverso + reverso). */
export function cardHTML(c, { playerLevel } = {}) {
  const fam = c.primaryGroup;
  const tier = tierOf(c.level);
  const secondary = c.muscleGroups.filter((g) => g !== fam).map((g) => GROUP_NAMES[g]).join(' · ');
  const video = c.video?.src
    ? `<video class="tc-video" src="${esc(c.video.src)}" ${c.video.poster ? `poster="${esc(c.video.poster)}"` : ''} muted loop playsinline preload="none" aria-label="Video: ${esc(c.name)}"></video>`
    : `<div class="tc-video placeholder"><canvas data-sprite="back" role="img" aria-label="Animación provisional: ${esc(c.name)}"></canvas><span>🎬 Video del movimiento: pendiente (director-creativo)</span></div>`;
  return `
  <div class="tcard fam-${fam} tier-${tier}" data-card="${esc(c.id)}" role="button" tabindex="0" aria-pressed="false" aria-label="Carta ${esc(c.name)}. Toca para ver cómo se hace.">
    <div class="tc-inner">
      <section class="tc-face tc-front">
        <header class="tc-head">
          <span class="tc-lvl" title="Nivel de la carta"><small>NV</small>${c.level}</span>
          <span class="tc-fam">${FAMILY_ICONS[fam] || ''} ${esc(GROUP_NAMES[fam] || fam)}</span>
          <span class="tc-tier" title="Rango ${TIER_NAMES[tier]}">${'★'.repeat(tier)}</span>
        </header>
        <div class="tc-art"><canvas data-sprite="front" role="img" aria-label="Ilustración provisional: ${esc(c.name)}"></canvas>
          ${c.draft ? '<span class="tc-draft" title="Contenido pendiente de validación por Entrenador">BORRADOR</span>' : ''}
        </div>
        <h2 class="tc-name">${esc(c.name)}</h2>
        <div class="tc-stats">
          <div class="tc-dose"><span class="tc-k">Reto</span><b>${esc(doseLabel(c))}</b></div>
          <div class="tc-time"><span class="tc-k">Tiempo</span><b>~${c.dose?.estimatedSec ?? 60} s</b></div>
        </div>
        <footer class="tc-foot">
          <span class="tc-pips" aria-label="Nivel ${c.level} de 10">${pips(c.level)}</span>
          <span class="tc-hint">${secondary ? esc(secondary) + ' · ' : ''}toca ↻</span>
        </footer>
      </section>
      <section class="tc-face tc-back" aria-hidden="true">
        <header class="tc-head"><span class="tc-fam">${esc(c.shortName || c.name)}</span><span class="tc-tier">↻</span></header>
        ${video}
        <div class="tc-info">
          <ol>${c.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
          ${c.cues?.length ? `<p><b>Clave:</b> ${c.cues.map(esc).join(' · ')}</p>` : ''}
          ${c.careZones?.length ? `<p class="tc-warn">⚠ Cuida: ${c.careZones.map((z) => esc(ZONE_NAMES[z] || z)).join(', ')}. ${c.contraindications?.map(esc).join(' ') || ''}</p>` : ''}
          <p class="tc-meta">📍 ${c.locations.map((l) => esc(PLACE_NAMES[l] || l)).join(', ')}${playerLevel ? ` · tu nivel en ${esc(GROUP_NAMES[fam])}: ${playerLevel}` : ''}</p>
          <p class="tc-meta"><a href="#/carta/${esc(c.id)}">Ficha completa y fuentes</a></p>
        </div>
      </section>
    </div>
  </div>`;
}

/** Monta animaciones y volteo. Devuelve cleanup. */
export function bindCard(el, c, { reducedMotion } = {}) {
  const stops = [];
  const front = el.querySelector('canvas[data-sprite=front]');
  if (front) stops.push(mountSprite(front, c.sprite, { reducedMotion }));
  let backStarted = false;
  const flip = () => {
    const flipped = el.classList.toggle('flipped');
    el.setAttribute('aria-pressed', String(flipped));
    el.querySelector('.tc-back').setAttribute('aria-hidden', String(!flipped));
    el.querySelector('.tc-front').setAttribute('aria-hidden', String(flipped));
    const v = el.querySelector('video.tc-video');
    if (v) { if (flipped) v.play().catch(() => {}); else v.pause(); }
    if (flipped && !backStarted) {
      const back = el.querySelector('canvas[data-sprite=back]');
      if (back) stops.push(mountSprite(back, c.sprite, { reducedMotion }));
      backStarted = true;
    }
  };
  el.addEventListener('click', (ev) => { if (!ev.target.closest('a')) flip(); });
  el.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); flip(); } });
  return () => stops.forEach((s) => s());
}
