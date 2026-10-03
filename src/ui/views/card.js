import { esc } from '../dom.js';
import { GROUP_NAMES, PLACE_NAMES, ZONE_NAMES, EFFORT_NAMES, REWARDS } from '../i18n/es.js';
import { mountSprite } from '../components/sprite.js';

export function doseLabel(c) {
  const d = c.dose || {};
  if (d.type === 'reps') return `${d.reps} reps${d.perSide ? ' / lado' : ''}`;
  if (d.type === 'hold') return `${d.durationSec} s sostén`;
  return `${d.durationSec} s`;
}

export function hud(s, compact = false) {
  const d = s.derived;
  const goal = d.dailyGoal;
  const dots = Array.from({ length: Math.max(goal, d.todayCount) }, (_, i) => `<span class="dot ${i < d.todayCount ? 'on' : ''}"></span>`).join('');
  const week = d.streak.last7.map((x) => `<span class="dot ${x.active ? 'on' : x.wildcard ? 'wild' : ''}" title="${x.day}"></span>`).join('');
  return `
    <div class="hud" aria-label="Mazo del día: ${d.todayCount} de ${goal}">
      <div class="dots" title="Mazo del día">${dots}</div>
    </div>
    <div class="streak" aria-label="Racha: ${d.streak.current} días">🔥${d.streak.current}${compact ? '' : `<span class="dots" style="margin-left:6px">${week}</span>`}</div>`;
}

export function renderCard(app) {
  const s = app.state;
  const c = s.card;
  const banners = [];
  if (s.reminderDue) banners.push(`<div class="banner" role="status"><span>⏰ ¡Hora de una carta! Tu mazo te espera.</span><button class="btn btn-ghost" data-act="dismiss-rem" aria-label="Cerrar aviso">✕</button></div>`);
  if (!c) {
    return `${banners.join('')}<div class="card"><p class="card-name">Sin cartas</p><p>No hay cartas que cumplan tus filtros (lugar y zonas a cuidar). Ajusta tu <a href="#/menu">menú</a>.</p></div>`;
  }
  const d = s.derived;
  const lvl = d.levels.byGroup[c.primaryGroup];
  const zones = (c.careZones || []).map((z) => `<span class="chip warn">⚠ ${esc(ZONE_NAMES[z] || z)}</span>`).join('');
  return `
  ${banners.join('')}
  <article class="card" aria-labelledby="card-name">
    ${c.draft ? `<div class="draft-badge" title="${esc(c.draftNote || '')}">BORRADOR · pendiente de Entrenador</div>` : ''}
    <div class="card-sprite"><canvas id="sprite" role="img" aria-label="Animación: ${esc(c.name)}"></canvas></div>
    <h2 class="card-name" id="card-name">${esc(c.name)}</h2>
    <div class="row" style="justify-content:space-between">
      <span class="dose">${esc(doseLabel(c))}</span>
      <span class="chip">Nv ${c.level} · tu nivel ${lvl}</span>
    </div>
    <div class="actions">
      <button class="btn btn-primary btn-big" data-act="done">¡Listo!</button>
      <button class="btn btn-big" data-act="skip" style="font-size:10px;padding:8px">Otra<br>carta</button>
    </div>
    <div class="chips">
      ${c.muscleGroups.map((g) => `<span class="chip">${esc(GROUP_NAMES[g] || g)}</span>`).join('')}
      ${c.locations.map((l) => `<span class="chip">📍${esc(PLACE_NAMES[l] || l)}</span>`).join('')}
    </div>
    ${zones ? `<div class="chips" aria-label="Zonas a cuidar">${zones}</div>` : ''}
    ${c.dose?.type !== 'reps' ? `<div class="row" style="justify-content:space-between"><button class="btn" data-act="timer">▶ Temporizador</button><span class="timer" id="timer" aria-live="polite">${c.dose.durationSec}s</span></div>` : ''}
    <details class="steps">
      <summary>Cómo se hace</summary>
      <ol>${c.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
      ${c.cues?.length ? `<p class="small muted">Clave: ${c.cues.map(esc).join(' · ')}</p>` : ''}
      ${c.contraindications?.length ? `<p class="small">⚠ ${c.contraindications.map(esc).join(' ')}</p>` : ''}
      <p class="small"><a href="#/carta/${esc(c.id)}">Ver ficha completa</a></p>
    </details>
  </article>`;
}

export function bindCard(root, app) {
  const s = app.state;
  let stop = () => {};
  let timerId = null;
  const canvas = root.querySelector('#sprite');
  if (canvas && s.card) stop = mountSprite(canvas, s.card.sprite, { reducedMotion: s.profile.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches });

  root.addEventListener('click', async (ev) => {
    const btn = ev.target.closest('[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    if (act === 'done') {
      btn.disabled = true;
      const r = await app.done();
      if (r) showReward(app, r);
    } else if (act === 'skip') {
      app.skip();
    } else if (act === 'dismiss-rem') {
      app.dismissReminder();
    } else if (act === 'timer') {
      const el = root.querySelector('#timer');
      let left = s.card.dose.durationSec;
      clearInterval(timerId);
      btn.textContent = '⏸ En marcha…';
      btn.disabled = true;
      timerId = setInterval(() => {
        left -= 1;
        el.textContent = `${left}s`;
        if (left <= 0) {
          clearInterval(timerId);
          el.textContent = '¡Tiempo!';
          btn.disabled = false;
          btn.textContent = '↻ Otra vez';
          if (navigator.vibrate) navigator.vibrate([80, 60, 80]);
        }
      }, 1000);
    }
  });
  return () => { stop(); clearInterval(timerId); };
}

function showReward(app, r) {
  const o = document.createElement('div');
  o.className = 'overlay';
  o.setAttribute('role', 'dialog');
  o.setAttribute('aria-modal', 'true');
  o.setAttribute('aria-label', 'Recompensa');
  const title = REWARDS[Math.floor(Math.random() * REWARDS.length)];
  o.innerHTML = `
    <div class="panel">
      <div class="reward-title" aria-live="assertive">${esc(title)}</div>
      <div class="xp">+${r.xp} XP</div>
      <div class="hud" style="justify-content:center">${hud(app.state).split('<div class="streak"')[0]}</div>
      <p class="muted small" style="margin:0">¿Cómo estuvo? (opcional)</p>
      <div class="effort">
        ${Object.entries(EFFORT_NAMES).map(([k, v]) => `<button class="btn" data-effort="${k}">${v}</button>`).join('')}
      </div>
      <button class="btn btn-primary" data-next>Siguiente carta ▶</button>
    </div>`;
  document.body.appendChild(o);
  o.querySelector('[data-next]').focus();
  const close = async (effort) => {
    o.remove();
    if (effort) await app.rate(r.event.id, effort);
    app.next();
  };
  o.addEventListener('click', (ev) => {
    const b = ev.target.closest('button');
    if (!b) return;
    close(b.dataset.effort || null);
  });
}

export function renderCardDetail(app, id) {
  const c = app.byId.get(id);
  if (!c) return `<p>Carta no encontrada. <a href="#/">Volver</a></p>`;
  const src = c.sources?.length
    ? `<ul>${c.sources.map((x) => `<li>${esc(x.citation)} ${x.doi ? `doi:${esc(x.doi)}` : ''} ${x.url ? `<a href="${esc(x.url)}" rel="noopener" target="_blank">enlace</a>` : ''}</li>`).join('')}</ul>`
    : `<p class="muted">Fuentes pendientes: esta carta es un <b>borrador</b> y no tiene citas todavía. Entrenador entregará la versión validada con referencias.</p>`;
  return `
    <p><a href="#/">← Volver a la carta</a></p>
    <article class="card">
      ${c.draft ? `<div class="draft-badge">BORRADOR · pendiente de Entrenador</div>` : ''}
      <h2 class="card-name">${esc(c.name)}</h2>
      <p class="dose">${esc(doseLabel(c))}</p>
      <h3>Pasos</h3><ol>${c.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
      <h3>Claves</h3><p>${(c.cues || []).map(esc).join(' · ') || '—'}</p>
      <h3>Variantes</h3>
      <p>Más fácil: ${c.easier ? `<a href="#/carta/${esc(c.easier)}">${esc(app.byId.get(c.easier)?.name || c.easier)}</a>` : '—'}<br>
         Más difícil: ${c.harder ? `<a href="#/carta/${esc(c.harder)}">${esc(app.byId.get(c.harder)?.name || c.harder)}</a>` : '—'}</p>
      <h3>Precauciones</h3>
      <p>${(c.careZones || []).map((z) => ZONE_NAMES[z]).join(', ') || '—'}</p>
      <p class="small">${(c.contraindications || []).map(esc).join(' ')}</p>
      <h3>Fuentes</h3>${src}
      <p class="small muted">Licencia del contenido: CC BY 4.0 · SnapFit</p>
    </article>`;
}
