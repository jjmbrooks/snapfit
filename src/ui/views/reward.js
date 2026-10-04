// Secuencia tras «¡Listo!»: felicitación → progreso (barras) → logros/subidas (si hay) → siguiente carta.
import { esc } from '../dom.js';
import { FAMILY_NAMES, BADGES, EFFORT_NAMES, REWARDS, FAMILY_ICONS, REGION_NAMES, t } from '../i18n/es.js';
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
    <div class="xp">${t('reward.xp', { n: xp })}</div>
    <p class="muted small">${t('reward.effortAsk')}</p>
    <div class="effort">${Object.entries(EFFORT_NAMES).map(([k, v]) => `<button class="btn" data-effort="${k}">${v}</button>`).join('')}</div>
    <button class="btn btn-primary" data-next>${t('reward.continue')}</button>`, 'seq-congrats');
  const effort = await waitNext(o1);
  if (effort) await app.rate(r.event.id, effort);
  const d = app.state.derived;

  // 2) Progreso
  const groupBars = card.muscleGroups.map((g) => {
    const p = d.levels.progress[g];
    const lvl = d.levels.byGroup[g];
    return bar(esc(t('reward.groupBar', { icon: FAMILY_ICONS[g] || '', group: FAMILY_NAMES[g], n: lvl })), p.ratio, lvl >= 10 ? t('reward.max') : t('reward.nextLevel', { n: lvl + 1 }), `fam-${g}`);
  }).join('');
  const o2 = screen(`
    <h2 class="seq-title">${t('reward.progressTitle')}</h2>
    ${bar(t('reward.today'), d.todayCount / d.dailyGoal, `${d.todayCount}/${d.dailyGoal}`, 'day')}
    ${bar(t('reward.streak'), Math.min(1, d.streak.current / 7), t(d.streak.current === 1 ? 'reward.day' : 'reward.days', { n: d.streak.current }), 'streak')}
    ${groupBars}
    <div class="seq-row"><span>${t('reward.globalLevel')} <b>${d.levels.global}</b></span><span>${t('reward.xpLabel')} <b>${d.xp}</b></span><span>${t('reward.cards')} <b>${d.totalDone}</b></span></div>
    <p class="seq-region">${esc(t('reward.region', { name: REGION_NAMES[d.levels.global] || '' }))}</p>
    <button class="btn btn-primary" data-next>${diff.newBadges.length || diff.levelChanges.length ? t('reward.seeBadges') : t('reward.nextCard')}</button>`, 'seq-progress');
  await waitNext(o2);

  // 3) Logros y subidas de nivel
  if (diff.newBadges.length || diff.levelChanges.length) {
    const lv = diff.levelChanges.map((c) => `<p class="lvlup">${t('reward.levelChange', { arrow: c.to > c.from ? '⬆' : '⬇', icon: FAMILY_ICONS[c.group] || '', group: esc(FAMILY_NAMES[c.group]), from: c.from, to: c.to })}</p>`).join('');
    const bd = diff.newBadges.map((b) => `<div class="badge-new"><canvas data-badge="${esc(b)}"></canvas><b>${esc(BADGES[b]?.[0] || b)}</b><span class="small muted">${esc(BADGES[b]?.[1] || '')}</span><button class="btn btn-sm" data-share="${esc(b)}">${t('reward.share')}</button></div>`).join('');
    const o3 = screen(`
      <h2 class="seq-title">${t('reward.badgeTitle')}</h2>
      ${lv}<div class="badge-row">${bd}</div>
      <button class="btn btn-primary" data-next>${t('reward.nextCard')}</button>`, 'seq-badges');
    o3.querySelectorAll('canvas[data-badge]').forEach((c) => drawBadge(c, c.dataset.badge, true));
    o3.addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-share]');
      if (b) { const id = b.dataset.share; shareBadge(id, BADGES[id]?.[0] || id, BADGES[id]?.[1] || ''); }
    });
    await waitNext(o3);
  }
  return after;
}
