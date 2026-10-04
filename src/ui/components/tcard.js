// Carta vertical estilo C «grimorio arcade» (elegido por Brooks, 2026-10-03). Proporción 5:7.
// Frente: gema de rango con el nivel · estandarte con el título · emblema de escuela · ventana de ilustración ·
//         pergamino (rango · escuela, series × reps) · escudo de XP.
// Reverso (al voltear): estandarte «cómo se hace» · 3 pasos con ranura de pose · tira con dosis + respiración.
// El marco, los textos y los emblemas son CSS/SVG; las imágenes (ilustración, poses, emblemas opcionales)
// vienen del paquete de historia o de la carta, con respaldo genérico. Estilos: src/ui/card/*.css.
import { esc } from '../dom.js';
import { GROUP_NAMES, FAMILY_NAMES, ZONE_NAMES, TIER_NAMES, t } from '../i18n/es.js';
import { mountSprite } from './sprite.js';
import { cardArtUrl, frameUrl, emblemUrl, packPoseUrls, publicUrl, currentStory } from '../story/index.js';
import { normalizeSteps, flavorOf, setsReps, tierOf, RANK_KEYS } from '../card/card-data.js';
import { emblemSVG } from '../card/emblems.js';
import { xpForCard } from '../../core/xp.js';

export { tierOf };

/** Dosis corta (series × reps / segundos). Se mantiene el nombre histórico. */
export const doseLabel = (c) => setsReps(c, t);

const POSE_PLACEHOLDER = `<svg class="ac-pose-ph" viewBox="0 0 24 32" aria-hidden="true"><circle cx="12" cy="6" r="4"/><path d="M12 10v11M12 13l-6 4M12 13l6 4M12 21l-5 9M12 21l5 9"/></svg>`;

/** HTML de la carta (anverso + reverso). opts.level permite mostrar la carta a otro nivel (muestras). */
export function cardHTML(c, { playerLevel, level } = {}) {
  const fam = c.primaryGroup;
  const lvl = level || c.level;
  const tier = tierOf(lvl);
  const S = currentStory().story || {};
  const school = FAMILY_NAMES[fam] || GROUP_NAMES[fam] || fam;
  const rank = TIER_NAMES[tier] || '';
  // Grupo muscular siempre visible en texto neutro (se entiende sin conocer la historia).
  const groups = [fam, ...c.muscleGroups.filter((g) => g !== fam)].map((g) => GROUP_NAMES[g]).join(' · ');
  const art = cardArtUrl(c.id);
  const skin = frameUrl(fam, tier);
  const emblem = emblemUrl(fam);
  const flavor = S.cardFlavor?.[c.id] || flavorOf(c);
  const steps = normalizeSteps(c);
  const packPoses = packPoseUrls(c.id);
  const backTitle = S.cardBack?.title || t('card.backTitle');
  const breath = c.breath || S.cardBack?.breath || t('card.breathDefault');
  const xp = xpForCard(lvl);
  const dose = esc(setsReps(c, t));
  const care = c.careZones?.length
    ? `<p class="ac-care">${t('card.careZones')} ${c.careZones.map((z) => esc(ZONE_NAMES[z] || z)).join(', ')}. ${c.contraindications?.map(esc).join(' ') || ''} <a href="#/carta/${esc(c.id)}">${t('card.fullSheet')}</a></p>`
    : `<p class="ac-care"><a href="#/carta/${esc(c.id)}">${t('card.fullSheet')}</a></p>`;
  return `
  <div class="tcard arcade fam-${fam} tier-${tier} rank-${RANK_KEYS[tier]}${skin ? ' has-skin' : ''}"${skin ? ` style="--frame-skin:url('${esc(skin)}')"` : ''} data-card="${esc(c.id)}" data-level="${lvl}" role="button" tabindex="0" aria-pressed="false" aria-label="${esc(t('card.aria', { name: c.name }))}">
    <div class="tc-inner">
      <section class="tc-face tc-front">
        <header class="ac-top">
          <span class="ac-gem" title="${esc(t('card.levelTitle', { n: lvl }))} · ${esc(t('card.tierTitle', { tier: rank }))}"><b>${lvl}</b></span>
          <h2 class="ac-banner tc-name">${esc(c.name)}</h2>
          <span class="ac-emblem" title="${esc(t('card.emblemTitle', { school }))}">${emblem ? `<img src="${esc(emblem)}" alt="" decoding="async">` : emblemSVG(fam)}</span>
        </header>
        <div class="ac-window tc-art${art ? ' has-art' : ''}">${art
          ? `<img class="tc-art-img" src="${esc(art)}" alt="${esc(t('card.artAria', { name: c.name }))}" decoding="async">`
          : `<canvas data-sprite="front" role="img" aria-label="${esc(t('card.artAria', { name: c.name }))}"></canvas>`}
          ${c.draft ? `<span class="tc-draft" title="${t('card.draftTitle')}">${t('card.draft')}</span>` : ''}
        </div>
        <div class="ac-parch">
          <p class="ac-rank tc-fam">${esc(t('card.rankSchool', { rank, school }))}</p>
          <p class="ac-dose">${dose}</p>
          ${flavor ? `<p class="ac-flavor">${esc(flavor)}</p>` : ''}
          <p class="ac-groups tc-hint">${esc(groups)} · ${t('card.flipHint')}</p>
        </div>
        <span class="ac-xp" title="${esc(t('card.xpTitle', { n: xp }))}"><b>${xp}</b><small>${t('card.xpUnit')}</small></span>
      </section>
      <section class="tc-face tc-back" aria-hidden="true">
        <h3 class="ac-banner ac-banner-back">${esc(backTitle)}</h3>
        <ol class="ac-steps">${steps.map((s, i) => {
          const pose = packPoses[i] || publicUrl(s.pose);
          return `<li class="ac-step" aria-label="${esc(t('card.stepAria', { n: i + 1 }))}">
            <span class="ac-num" aria-hidden="true">${i + 1}</span>
            <span class="ac-pose${pose ? '' : ' empty'}">${pose ? `<img src="${esc(pose)}" alt="${esc(t('card.poseAria', { n: i + 1 }))}" loading="lazy" decoding="async">` : `${POSE_PLACEHOLDER}<small>${t('card.posePending')}</small>`}</span>
            <span class="ac-step-text">${esc(s.text)}</span>
          </li>`;
        }).join('')}</ol>
        <p class="ac-strip"><b>${dose}</b> · ${esc(breath)}</p>
        ${care}
        ${playerLevel ? `<p class="ac-meta">${esc(t('card.playerLevel', { group: GROUP_NAMES[fam], n: playerLevel }))} · ${t('card.flipBack')}</p>` : ''}
      </section>
    </div>
  </div>`;
}

/** Monta la animación de respaldo (si no hay ilustración) y el volteo. Devuelve cleanup. */
export function bindCard(el, c, { reducedMotion } = {}) {
  const stops = [];
  const front = el.querySelector('canvas[data-sprite=front]');
  if (front) stops.push(mountSprite(front, c.sprite, { reducedMotion }));
  const flip = () => {
    const flipped = el.classList.toggle('flipped');
    el.setAttribute('aria-pressed', String(flipped));
    el.querySelector('.tc-back').setAttribute('aria-hidden', String(!flipped));
    el.querySelector('.tc-front').setAttribute('aria-hidden', String(flipped));
  };
  el.addEventListener('click', (ev) => { if (!ev.target.closest('a')) flip(); });
  el.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); flip(); } });
  return () => stops.forEach((s) => s());
}
