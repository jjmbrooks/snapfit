import { esc, toast } from '../dom.js';
import { THEME_NAMES, PLACE_NAMES, ZONE_NAMES, REMINDER_NAMES } from '../i18n/es.js';
import { THEMES, PLACES, CARE_ZONES, REMINDER_PATTERNS, isHHMM } from '../../core/index.js';
import { notificationSupport, requestPermission, registerPeriodicReminder } from '../../adapters/notify-local.js';

const SWATCH = {
  medianoche: ['#0f1020', '#ffd23f'], manana: ['#f4f1e8', '#2f5d50'], chicle: ['#ffe3f0', '#c2185b'],
  selva: ['#0d2016', '#7ddc4f'], pacifico: ['#06213d', '#4fc3f7'], volcan: ['#230b08', '#ff7a3d'],
};

export function renderMenu(app) {
  const s = app.state;
  const p = s.profile;
  const ns = notificationSupport();
  const chips = (name, list, names, selected) => list.map((v) => `<label><input type="checkbox" name="${name}" value="${v}" ${selected.includes(v) ? 'checked' : ''}> ${esc(names[v])}</label>`).join('');
  const sync = s.sync;
  const syncTxt = !s.user ? '' : sync.status === 'syncing' ? 'Sincronizando…' : sync.status === 'error' ? `⚠ Sin sincronizar (${esc(sync.error)})` : sync.lastAt ? `✓ Sincronizado ${new Date(sync.lastAt).toLocaleTimeString()}` : '';
  return `
  <h2>Menú</h2>
  <fieldset><legend>Tema</legend>
    <div class="swatches">
      ${THEMES.map((t) => `<button class="swatch" data-theme-pick="${t}" aria-pressed="${p.theme === t}" style="background:${SWATCH[t][0]};color:${SWATCH[t][1]}"><span class="sw" style="background:${SWATCH[t][1]}"></span>${esc(THEME_NAMES[t])}</button>`).join('')}
    </div>
  </fieldset>

  <fieldset><legend>¿Dónde estás?</legend>
    <p class="small muted" style="margin-top:0">Sin selección = cartas para cualquier lugar.</p>
    <div class="toggle-chips" data-group="places">${chips('places', PLACES, PLACE_NAMES, p.places)}</div>
  </fieldset>

  <fieldset><legend>Zonas a cuidar</legend>
    <p class="small muted" style="margin-top:0">Las cartas que cargan estas zonas no aparecerán (o verás su variante más fácil).</p>
    <div class="toggle-chips" data-group="careZones">${chips('careZones', CARE_ZONES, ZONE_NAMES, p.careZones)}</div>
  </fieldset>

  <fieldset><legend>Meta diaria</legend>
    <div class="row"><label for="goal">Cartas por día</label>
      <select id="goal">${[1, 2, 3, 4, 5, 6, 8, 10].map((n) => `<option ${p.dailyGoal === n ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
  </fieldset>

  <fieldset><legend>Recordatorios</legend>
    <div class="row"><label for="rem">Patrón</label>
      <select id="rem">${REMINDER_PATTERNS.map((r) => `<option value="${r}" ${p.reminders.pattern === r ? 'selected' : ''}>${esc(REMINDER_NAMES[r])}</option>`).join('')}</select></div>
    <div class="row" id="custom-times" style="margin-top:var(--s3);${p.reminders.pattern === 'custom' ? '' : 'display:none'}">
      ${[0, 1, 2].map((i) => `<input type="time" data-ct="${i}" value="${esc(p.reminders.customTimes[i] || '')}" aria-label="Hora ${i + 1}">`).join('')}
    </div>
    <p class="small muted">Recordatorios locales: aviso dentro de la app y notificación con la app abierta. ${ns.periodicSync ? 'Con la app instalada, Chrome puede despertar la app periódicamente (frecuencia decidida por el navegador).' : 'Tu navegador no soporta recordatorios en segundo plano; usa la app instalada en Android Chrome.'}</p>
    <div class="row">
      <span class="small">Notificaciones: <b>${esc({ granted: 'permitidas', denied: 'bloqueadas', default: 'sin pedir', unsupported: 'no soportadas' }[ns.permission])}</b></span>
      ${ns.permission === 'default' ? '<button class="btn" data-act="perm">Permitir notificaciones</button>' : ''}
    </div>
  </fieldset>

  <fieldset><legend>Preferencias</legend>
    <label class="switch">Sonido chiptune <input type="checkbox" id="sound" ${p.sound ? 'checked' : ''}></label>
    <label class="switch">Reducir animaciones <input type="checkbox" id="rm" ${p.reducedMotion ? 'checked' : ''}></label>
    <label class="switch">Estadísticas anónimas de uso <input type="checkbox" id="an" ${p.analytics ? 'checked' : ''}></label>
    <p class="small muted" style="margin:0">Solo eventos como «carta hecha» o «cambio de tema», sin datos personales. <a href="#/privacidad">Aviso de privacidad</a></p>
  </fieldset>

  <fieldset><legend>Cuenta y respaldo</legend>
    ${s.user
      ? `<p style="margin-top:0">Conectado como <b>${esc(s.user.displayName || 'usuario de Google')}</b></p>
         <p class="small muted">${syncTxt}</p>
         <div class="btn-row"><button class="btn" data-act="sync">↻ Sincronizar</button><button class="btn btn-ghost" data-act="signout">Cerrar sesión</button></div>`
      : `<p class="small muted" style="margin-top:0">Opcional. SnapFit funciona sin cuenta y sin internet. Con Google respaldas tu progreso y lo usas en varios dispositivos.</p>
         <button class="btn btn-accent" data-act="signin" ${s.online ? '' : 'disabled'}>Entrar con Google</button>`}
    <h3>Exportar / importar</h3>
    <div class="btn-row">
      <button class="btn" data-act="export-json">⬇ JSON</button>
      <button class="btn" data-act="export-csv">⬇ CSV</button>
      <label class="btn">⬆ Importar<input type="file" accept="application/json,.json" id="import" class="sr-only"></label>
    </div>
    <h3>Zona de peligro</h3>
    <div class="btn-row">
      <button class="btn btn-danger" data-act="wipe">Borrar datos de este dispositivo</button>
      ${s.user ? '<button class="btn btn-danger" data-act="delete-account">Borrar mi cuenta y datos en la nube</button>' : ''}
    </div>
  </fieldset>

  <fieldset><legend>Acerca de</legend>
    <p class="small" style="margin-top:0">SnapFit v${esc(s.appVersion)} · Código MIT · Contenido y assets CC BY 4.0 · © 2026 jjmbrooks.</p>
    <p class="small">Las cartas actuales son <b>borradores</b> pendientes de validación por Entrenador. SnapFit no sustituye una valoración médica.</p>
    <p class="small">Fuente de títulos: Press Start 2P (SIL OFL 1.1). Animaciones, insignias y sonidos provisionales generados por código.</p>
    <p class="small"><a href="#/privacidad">Aviso de privacidad</a> · <a href="https://github.com/jjmbrooks/snapfit" target="_blank" rel="noopener">Código en GitHub</a></p>
  </fieldset>`;
}

export function bindMenu(root, app, deps) {
  const p = () => app.state.profile;
  // Precarga el módulo de auth para que el popup conserve la activación del usuario.
  if (!app.state.user && navigator.onLine) deps.preloadAuth?.();
  root.addEventListener('click', async (ev) => {
    const t = ev.target.closest('[data-theme-pick]');
    if (t) return app.updateProfile({ theme: t.dataset.themePick });
    const b = ev.target.closest('[data-act]');
    if (!b) return;
    const act = b.dataset.act;
    try {
      if (act === 'perm') {
        const r = await requestPermission();
        if (r === 'granted') await registerPeriodicReminder(p().reminders.pattern !== 'off');
        app.emit();
      } else if (act === 'signin') {
        b.disabled = true;
        await deps.signIn();
      } else if (act === 'signout') {
        await deps.signOut();
      } else if (act === 'sync') {
        await app.syncNow();
      } else if (act === 'export-json') app.exportJson();
      else if (act === 'export-csv') app.exportCsv();
      else if (act === 'wipe') {
        if (confirm('¿Borrar TODO tu progreso de este dispositivo? (Exporta antes si quieres conservarlo)')) await app.deleteAllLocal();
      } else if (act === 'delete-account') {
        if (confirm('¿Borrar tu cuenta y todos tus datos en la nube? Esto no se puede deshacer.')) await deps.deleteAccount();
      }
    } catch (e) {
      toast('Ups', e?.code === 'auth/popup-closed-by-user' ? 'Inicio de sesión cancelado.' : `Error: ${e?.code || e?.message || e}`);
      app.emit();
    }
  });
  root.addEventListener('change', async (ev) => {
    const el = ev.target;
    const group = el.closest('[data-group]')?.dataset.group;
    if (group) {
      const vals = [...root.querySelectorAll(`[data-group="${group}"] input:checked`)].map((i) => i.value);
      return app.updateProfile({ [group]: vals });
    }
    if (el.id === 'goal') return app.updateProfile({ dailyGoal: Number(el.value) });
    if (el.id === 'rem') return app.updateProfile({ reminders: { ...p().reminders, pattern: el.value } });
    if (el.dataset.ct != null) {
      const times = [...root.querySelectorAll('[data-ct]')].map((i) => i.value).filter(isHHMM);
      return app.updateProfile({ reminders: { ...p().reminders, customTimes: times } });
    }
    if (el.id === 'sound') return app.updateProfile({ sound: el.checked });
    if (el.id === 'rm') return app.updateProfile({ reducedMotion: el.checked });
    if (el.id === 'an') return app.updateProfile({ analytics: el.checked });
    if (el.id === 'import' && el.files?.[0]) {
      try {
        const r = await app.importJson(await el.files[0].text());
        toast('Importado', `${r.added.length} eventos nuevos${r.rejected ? `, ${r.rejected} inválidos` : ''}.`);
      } catch (e) { toast('No se pudo importar', e.message); }
    }
  });
}
