import { esc } from '../dom.js';
import { GROUP_NAMES, BADGES, FAMILY_ICONS, FAMILY_NAMES, REGION_NAMES, t } from '../i18n/es.js';
import { MUSCLE_GROUPS } from '../../core/index.js';
import { hud } from './card.js';

export function renderProgress(app) {
  const d = app.state.derived;
  const max = Math.max(1, ...d.history.map((h) => h.count));
  const bars = d.history.map((h) => `<i class="${h.count ? '' : 'zero'}" style="height:${h.count ? Math.max(8, (h.count / max) * 100) : 4}%" title="${h.day}: ${h.count}"></i>`).join('');
  const lv = MUSCLE_GROUPS.map((g) => {
    const n = d.levels.byGroup[g];
    const segs = Array.from({ length: 10 }, (_, i) => `<span class="seg ${i < n ? 'on' : ''}"></span>`).join('');
    return `<div class="lvl-row fam-${g}"><span title="${esc(FAMILY_NAMES[g])}">${FAMILY_ICONS[g]} ${esc(GROUP_NAMES[g])}</span><span class="segs" aria-label="Nivel ${n} de 10">${segs}</span><span class="lvl-n">${n}</span></div>`;
  }).join('');
  const recentBadges = d.badges.slice(-3).map((b) => `<span class="chip">🏅 ${esc(BADGES[b]?.[0] || b)}</span>`).join('');
  return `<div class="page">
    <h2>Progreso</h2>
    <div class="card" style="gap:var(--s2)">
      <div class="row" style="justify-content:space-between">${hud(app.state)}</div>
      <div class="bar big"><i style="width:${Math.min(100, Math.round((d.todayCount / d.dailyGoal) * 100))}%"></i></div>
      <p class="small muted" style="margin:0">Hoy: ${d.todayCount} de ${d.dailyGoal} cartas · Racha: ${d.streak.current} días (mejor: ${d.maxStreak})${d.streak.wildcardUsedThisWeek ? ' · comodín usado esta semana' : ''}</p>
    </div>
    <div class="stats" style="margin-top:var(--s4)">
      <div class="stat"><span class="n">${d.levels.global}</span><span class="l">Nivel global</span></div>
      <div class="stat"><span class="n">${d.xp}</span><span class="l">XP</span></div>
      <div class="stat"><span class="n">${d.totalDone}</span><span class="l">Cartas</span></div>
    </div>
    <p class="region-line">${esc(t('progress.region', { name: REGION_NAMES[d.levels.global] || '' }))}</p>
    <h3>Nivel por grupo</h3>
    <div class="card">${lv}<p class="small muted" style="margin:0">Cuerpo completo esta semana: ${d.weekCoverage.length}/7 grupos. El nivel sube con constancia y esfuerzo cómodo (heurística en borrador).</p></div>
    <h3>Historial (30 días)</h3>
    <div class="histo" aria-label="Cartas por día, últimos 30 días">${bars}</div>
    <h3>Insignias (${d.badges.length})</h3>
    <div class="chips">${recentBadges || '<span class="muted small">Completa tu primera carta para ganar la primera.</span>'}</div>
    <p style="margin-top:var(--s4)"><a class="btn" href="#/logros">🏆 Ver vitrina de logros</a></p></div>`;
}
