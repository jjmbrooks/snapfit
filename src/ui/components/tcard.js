// Carta estilo «carta de personaje»: marco por familia (grupo muscular) y nivel; volteo 3D al tocar.
// El arte final (ilustración + video) llegará de director-creativo; mientras, animación generada por código.
import { esc } from '../dom.js';
import { GROUP_NAMES, FAMILY_NAMES, PLACE_NAMES, ZONE_NAMES, FAMILY_ICONS, TIER_NAMES, t } from '../i18n/es.js';
import { mountSprite } from './sprite.js';

export function doseLabel(c) {
  const d = c.dose || {};
  if (d.type === 'reps') return t('card.repsUnit', { n: d.reps }) + (d.perSide ? t('card.perSide') : '');
  if (d.type === 'hold') return t('card.holdUnit', { n: d.durationSec });
  return t('card.secUnit', { n: d.durationSec });
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
    ? `<video class="tc-video" src="${esc(c.video.src)}" ${c.video.poster ? `poster="${esc(c.video.poster)}"` : ''} muted loop playsinline preload="none" aria-label="${esc(t('card.videoAria', { name: c.name }))}"></video>`
    : `<div class="tc-video placeholder"><canvas data-sprite="back" role="img" aria-label="${esc(t('card.videoPlaceholderAria', { name: c.name }))}"></canvas><span>${t('card.videoPending')}</span></div>`;
  return `
  <div class="tcard fam-${fam} tier-${tier}" data-card="${esc(c.id)}" role="button" tabindex="0" aria-pressed="false" aria-label="${esc(t('card.aria', { name: c.name }))}">
    <div class="tc-inner">
      <section class="tc-face tc-front">
        <header class="tc-head">
          <span class="tc-lvl" title="${t('card.levelTitle')}"><small>${t('card.levelShort')}</small>${c.level}</span>
          <span class="tc-fam">${FAMILY_ICONS[fam] || ''} ${esc(FAMILY_NAMES[fam] || fam)}</span>
          <span class="tc-tier" title="${esc(t('card.tierTitle', { tier: TIER_NAMES[tier] }))}">${'★'.repeat(tier)}</span>
        </header>
        <div class="tc-art"><canvas data-sprite="front" role="img" aria-label="${esc(t('card.artAria', { name: c.name }))}"></canvas>
          ${c.draft ? `<span class="tc-draft" title="${t('card.draftTitle')}">${t('card.draft')}</span>` : ''}
        </div>
        <h2 class="tc-name">${esc(c.name)}</h2>
        <div class="tc-stats">
          <div class="tc-dose"><span class="tc-k">${t('card.dose')}</span><b>${esc(doseLabel(c))}</b></div>
          <div class="tc-time"><span class="tc-k">${t('card.time')}</span><b>${t('card.timeValue', { s: c.dose?.estimatedSec ?? 60 })}</b></div>
        </div>
        <footer class="tc-foot">
          <span class="tc-pips" aria-label="${t('card.levelAria', { n: c.level })}">${pips(c.level)}</span>
          <span class="tc-hint">${secondary ? esc(secondary) + ' · ' : ''}${t('card.flipHint')}</span>
        </footer>
      </section>
      <section class="tc-face tc-back" aria-hidden="true">
        <header class="tc-head"><span class="tc-fam">${esc(c.shortName || c.name)}</span><span class="tc-tier">↻</span></header>
        ${video}
        <div class="tc-info">
          <ol>${c.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
          ${c.cues?.length ? `<p><b>${t('card.cues')}</b> ${c.cues.map(esc).join(' · ')}</p>` : ''}
          ${c.careZones?.length ? `<p class="tc-warn">${t('card.careZones')} ${c.careZones.map((z) => esc(ZONE_NAMES[z] || z)).join(', ')}. ${c.contraindications?.map(esc).join(' ') || ''}</p>` : ''}
          <p class="tc-meta">📍 ${c.locations.map((l) => esc(PLACE_NAMES[l] || l)).join(', ')}${playerLevel ? ` · ${esc(t('card.playerLevel', { group: GROUP_NAMES[fam], n: playerLevel }))}` : ''}</p>
          <p class="tc-meta"><a href="#/carta/${esc(c.id)}">${t('card.fullSheet')}</a></p>
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
