import { esc, toast } from '../dom.js';
import { BADGES } from '../i18n/es.js';
import { BADGE_IDS } from '../../core/index.js';
import { drawBadge } from '../components/sprite.js';
import { shareBadge } from '../components/share.js';

export function renderAchievements(app) {
  const got = new Set(app.state.derived.badges);
  const items = BADGE_IDS.map((id) => {
    const [name, desc] = BADGES[id] || [id, ''];
    const on = got.has(id);
    return `<div class="badge ${on ? '' : 'locked'}">
      <canvas data-badge="${esc(id)}" data-on="${on}" role="img" aria-label="${esc(name)}${on ? '' : ' (bloqueada)'}"></canvas>
      <span class="bname">${on ? esc(name) : '???'}</span>
      <span class="bdesc">${esc(desc)}</span>
      ${on ? `<button class="btn" data-share="${esc(id)}" style="font-size:9px;min-height:40px">Compartir</button>` : ''}
    </div>`;
  }).join('');
  return `<div class="page"><h2>Logros · ${got.size}/${BADGE_IDS.length}</h2>
    <p class="small muted">Insignias provisionales generadas por código; el arte final llegará de director-creativo.</p>
    <div class="badges">${items}</div></div>`;
}

export function bindAchievements(root) {
  root.querySelectorAll('canvas[data-badge]').forEach((c) => drawBadge(c, c.dataset.badge, c.dataset.on === 'true'));
  root.addEventListener('click', async (ev) => {
    const b = ev.target.closest('[data-share]');
    if (!b) return;
    const id = b.dataset.share;
    const [name, desc] = BADGES[id] || [id, ''];
    const r = await shareBadge(id, name, desc);
    if (r === 'downloaded') toast('Imagen lista', 'Se descargó la imagen del logro para compartir.');
  });
}
