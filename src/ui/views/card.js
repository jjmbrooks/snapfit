import { esc } from '../dom.js';
import { t, ZONE_NAMES } from '../i18n/es.js';
import { cardHTML, bindCard as bindTCard, doseLabel } from '../components/tcard.js';
import { runRewardSequence } from './reward.js';
import { normalizeSteps } from '../card/card-data.js';

export { doseLabel };

/** Mini HUD de la barra superior: progreso del día + racha. */
export function hud(s) {
  const d = s.derived;
  const pct = Math.min(100, Math.round((d.todayCount / d.dailyGoal) * 100));
  return `
    <div class="hud-day" aria-label="${t('play.hudTodayAria', { done: d.todayCount, goal: d.dailyGoal })}">
      <span class="hud-k">${t('play.hudToday')}</span>
      <span class="bar"><i style="width:${pct}%"></i></span>
      <span class="hud-n">${d.todayCount}/${d.dailyGoal}</span>
    </div>
    <div class="hud-streak" aria-label="${t('play.hudStreakAria', { n: d.streak.current })}">🔥<b>${d.streak.current}</b></div>`;
}

export function renderCard(app) {
  const s = app.state;
  const c = s.card;
  const rem = s.reminderDue
    ? `<div class="banner" role="status"><span>${t('play.reminder')}</span><button class="btn btn-ghost btn-sm" data-act="dismiss-rem" aria-label="${t('play.closeAria')}">✕</button></div>`
    : '';
  if (!c) {
    return `${rem}<div class="empty"><p class="pixel">${t('play.emptyTitle')}</p><p>${t('play.emptyBody')}</p></div>`;
  }
  return `
  <div class="play">
    ${rem}
    <div class="stage" id="stage">
      <div class="deck-under" aria-hidden="true"><i></i><i></i></div>
      ${cardHTML(c, { playerLevel: s.derived.levels.byGroup[c.primaryGroup] })}
    </div>
    <div class="play-actions">
      <button class="btn btn-primary btn-listo" data-act="done">${t('play.done')}</button>
      <button class="btn btn-otro" data-act="skip" aria-label="${t('play.skipAria')}">${t('play.skip')}</button>
    </div>
    <p class="deck-count">${t('play.deckCount', { n: app.deckSize() })}</p>
  </div>`;
}

export function bindCard(root, app, { dealt } = {}) {
  const s = app.state;
  const el = root.querySelector('.tcard');
  const reduced = s.profile.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stop = () => {};
  if (el && s.card) {
    stop = bindTCard(el, s.card, { reducedMotion: reduced });
    if (dealt && !reduced) el.classList.add(dealt === 'skip' ? 'deal-under' : 'deal-in');
  }
  root.addEventListener('click', async (ev) => {
    const btn = ev.target.closest('[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    if (act === 'done') {
      root.querySelectorAll('[data-act]').forEach((b) => (b.disabled = true));
      if (el && !reduced) { el.classList.add('played'); await wait(380); }
      const r = await app.done();
      if (r) await runRewardSequence(app, r);
      app.lastDeal = 'done';
      app.emit();
    } else if (act === 'skip') {
      root.querySelectorAll('[data-act]').forEach((b) => (b.disabled = true));
      if (el && !reduced) { el.classList.add('to-bottom'); await wait(320); }
      app.lastDeal = 'skip';
      app.skip();
    } else if (act === 'dismiss-rem') {
      app.dismissReminder();
    }
  });
  return stop;
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function renderCardDetail(app, id) {
  const c = app.byId.get(id);
  if (!c) return `<p>Carta no encontrada. <a href="#/">Volver</a></p>`;
  const src = c.sources?.length
    ? `<ul>${c.sources.map((x) => `<li>${esc(x.citation)} ${x.doi ? `doi:${esc(x.doi)}` : ''} ${x.url ? `<a href="${esc(x.url)}" rel="noopener" target="_blank">enlace</a>` : ''}</li>`).join('')}</ul>`
    : `<p class="muted">Fuentes pendientes: esta carta es un <b>borrador</b> sin citas todavía. Entrenador entregará la versión validada con referencias.</p>`;
  return `
    <div class="page">
    <p><a href="#/">← Volver a la carta</a></p>
    <article class="panel-card">
      ${c.draft ? `<span class="tc-draft static">BORRADOR · pendiente de Entrenador</span>` : ''}
      <h2>${esc(c.name)}</h2>
      <p class="big-num">${esc(doseLabel(c))}</p>
      <h3>Pasos</h3><ol>${normalizeSteps(c).map((x) => `<li>${esc(x.text)}</li>`).join('')}</ol>
      <h3>Claves</h3><p>${(c.cues || []).map(esc).join(' · ') || '—'}</p>
      <h3>Variantes</h3>
      <p>Más fácil: ${c.easier ? `<a href="#/carta/${esc(c.easier)}">${esc(app.byId.get(c.easier)?.name || c.easier)}</a>` : '—'}<br>
         Más difícil: ${c.harder ? `<a href="#/carta/${esc(c.harder)}">${esc(app.byId.get(c.harder)?.name || c.harder)}</a>` : '—'}</p>
      <h3>Precauciones</h3>
      <p>${(c.careZones || []).map((z) => ZONE_NAMES[z]).join(', ') || '—'}</p>
      <p class="small">${(c.contraindications || []).map(esc).join(' ')}</p>
      <h3>Fuentes</h3>${src}
      <p class="small muted">Licencia del contenido: CC BY 4.0 · SnapFit</p>
    </article></div>`;
}

/** Muestra de una carta a otro nivel (#/muestra/:id/:nivel): galería de los 4 rangos para QA y capturas.
 *  Solo lectura: no hay ¡Listo!/Otro y no se registra ningún evento. */
export function renderSample(app, { id, level }) {
  const c = app.byId.get(id);
  if (!c) return `<p class="page">${t('sample.notFound')} <a href="#/">${t('sample.back')}</a></p>`;
  const links = [1, 4, 7, 10].map((n) => `<a class="btn btn-sm${n === level ? ' on' : ''}" href="#/muestra/${esc(id)}/${n}" ${n === level ? 'aria-current="page"' : ''}>${n}</a>`).join('');
  return `
  <div class="play sample">
    <p class="sample-k">${t('sample.label', { level })}</p>
    <div class="stage" id="stage">${cardHTML(c, { level })}</div>
    <nav class="sample-nav" aria-label="${t('sample.navAria')}">${links}<a class="btn btn-sm btn-ghost" href="#/">${t('sample.back')}</a></nav>
  </div>`;
}
export function bindSample(root, app) {
  const el = root.querySelector('.tcard');
  const id = el?.dataset.card;
  if (!el || !app.byId.get(id)) return () => {};
  const reduced = app.state.profile.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
  return bindTCard(el, app.byId.get(id), { reducedMotion: reduced });
}
