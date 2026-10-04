// Secuencia tras «¡Listo!»: felicitación → progreso (barras) → logros/subidas (si hay) → siguiente carta.
import { esc } from '../dom.js';
import { GROUP_NAMES, BADGES, EFFORT_NAMES, REWARDS, FAMILY_ICONS } from '../i18n/es.js';
import { drawBadge } from '../components/sprite.js';
import { shareBadge } from '../components/share.js';

function screen(html, cls = '') {
  const o = document.createElement('div');
  o.className = `overlay seq ${cls}`;
  o.setAttribute('role', 'dialog');
  o.setAttribute('aria-modal', 'true');
  o.innerHTML = `<div class="seq-panel">${html}</div>`;
  document.body.appendChild(o);
  o.querySelector('[data-next]')?.focus();
  return o;
}

function waitNext(o) {
  return new Promise((resolve) => {
    o.addEventListener('click', (ev) => {
      const b = ev.target.closest('button');
      if (!b || b.dataset.share) return;
      if (b.dataset.effort || b.dataset.next != null) { o.classList.add('leaving'); setTimeout(() => o.remove(), 180); resolve(b.dataset.effort || null); }
    });
  });
}

const bar = (label, ratio, right, cls = '') => `
  <div class="pbar ${cls}"><div class="pbar-top"><span>${label}</span><span>${right}</span></div>
  <div class="bar big"><i style="width:${Math.round(Math.min(1, ratio) * 100)}%"></i></div></div>`;

export async function runRewardSequence(app, r) {
  const { card, xp, diff, after } = r;
  const title = REWARDS[Math.floor(Math.random() * REWARDS.length)];

  // 1) Felicitación
  const o1 = screen(`
    <div class="confetti" aria-hidden="true">${'<i></i>'.repeat(14)}</div>
    <p class="seq-kicker">${FAMILY_ICONS[card.primaryGroup] || ''} ${esc(card.name)}</p>
    <div class="reward-title" aria-live="assertive">${esc(title)}</div>
    <div class="xp">+${xp} XP</div>
    <p class="muted small">¿Cómo te sentiste? (opcional, ayuda a ajustar tu nivel)</p>
    <div class="effort">${Object.entries(EFFORT_NAMES).map(([k, v]) => `<button class="btn" data-effort="${k}">${v}</button>`).join('')}</div>
    <button class="btn btn-primary" data-next>Continuar ▶</button>`, 'seq-congrats');
  const effort = await waitNext(o1);
  if (effort) await app.rate(r.event.id, effort);
  const d = app.state.derived;

  // 2) Progreso
  const groupBars = card.muscleGroups.map((g) => {
    const p = d.levels.progress[g];
    const lvl = d.levels.byGroup[g];
    return bar(`${FAMILY_ICONS[g] || ''} ${esc(GROUP_NAMES[g])} · Nv ${lvl}`, p.ratio, lvl >= 10 ? 'MAX' : `→ Nv ${lvl + 1}`, `fam-${g}`);
  }).join('');
  const o2 = screen(`
    <h2 class="seq-title">Tu progreso</h2>
    ${bar('Mazo de hoy', d.todayCount / d.dailyGoal, `${d.todayCount}/${d.dailyGoal}`, 'day')}
    ${bar(`🔥 Racha`, Math.min(1, d.streak.current / 7), `${d.streak.current} día${d.streak.current === 1 ? '' : 's'}`, 'streak')}
    ${groupBars}
    <div class="seq-row"><span>Nivel global <b>${d.levels.global}</b></span><span>XP <b>${d.xp}</b></span><span>Cartas <b>${d.totalDone}</b></span></div>
    <button class="btn btn-primary" data-next>${diff.newBadges.length || diff.levelChanges.length ? 'Ver logros ▶' : 'Siguiente carta ▶'}</button>`, 'seq-progress');
  await waitNext(o2);

  // 3) Logros y subidas de nivel
  if (diff.newBadges.length || diff.levelChanges.length) {
    const lv = diff.levelChanges.map((c) => `<p class="lvlup">${c.to > c.from ? '⬆' : '⬇'} ${FAMILY_ICONS[c.group] || ''} ${esc(GROUP_NAMES[c.group])}: nivel ${c.from} → <b>${c.to}</b></p>`).join('');
    const bd = diff.newBadges.map((b) => `<div class="badge-new"><canvas data-badge="${esc(b)}"></canvas><b>${esc(BADGES[b]?.[0] || b)}</b><span class="small muted">${esc(BADGES[b]?.[1] || '')}</span><button class="btn btn-sm" data-share="${esc(b)}">Compartir</button></div>`).join('');
    const o3 = screen(`
      <h2 class="seq-title">¡Logro desbloqueado!</h2>
      ${lv}<div class="badge-row">${bd}</div>
      <button class="btn btn-primary" data-next>Siguiente carta ▶</button>`, 'seq-badges');
    o3.querySelectorAll('canvas[data-badge]').forEach((c) => drawBadge(c, c.dataset.badge, true));
    o3.addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-share]');
      if (b) { const id = b.dataset.share; shareBadge(id, BADGES[id]?.[0] || id, BADGES[id]?.[1] || ''); }
    });
    await waitNext(o3);
  }
  return after;
}
