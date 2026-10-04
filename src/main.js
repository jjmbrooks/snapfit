// Composición: core (puro) + adaptadores + UI.
import './ui/styles/index.css';
import cards from '../content/cards/adulto-general.draft.json';
import deckAdulto from '../content/decks/adulto-general.json';
import leveling from '../content/leveling.json';
import { storage } from './adapters/storage-idb.js';
import { clock } from './adapters/clock.js';
import { createApp } from './ui/app.js';
import { parseRoute } from './ui/router.js';
import { renderCard, bindCard, renderCardDetail, renderSample, bindSample, hud } from './ui/views/card.js';
import { renderProgress } from './ui/views/progress.js';
import { renderAchievements, bindAchievements } from './ui/views/achievements.js';
import { renderMenu, bindMenu } from './ui/views/menu.js';
import { renderPrivacy } from './ui/views/privacy.js';
import { renderOnboarding, bindOnboarding, startProfileEdit } from './ui/views/onboarding.js';
import { toast } from './ui/dom.js';
import { initStory, listPacks } from './ui/story/index.js';

const APP_VERSION = __APP_VERSION__;
const app = createApp({ storage, clock, cards, decks: [deckAdulto], leveling, appVersion: APP_VERSION });

let viewRef = document.getElementById('view');
const hudEl = document.getElementById('hud');
const shell = document.getElementById('app');
let cleanup = () => {};
let lastRoute = null;

// ---------- Auth (Google obligatorio en el primer uso; luego funciona offline) ----------
let authApi = null;
async function loadAuth() {
  if (!authApi) {
    authApi = await import('./adapters/firebase/auth.js');
    await authApi.watchAuth((u) => { if (u) app.setUser(u); });
  }
  return authApi;
}
const authDeps = {
  preloadAuth() { loadAuth().catch(() => {}); },
  async signIn() { const a = await loadAuth(); await a.signInWithGoogle(); },
  async signOut() { const a = await loadAuth(); await a.signOutUser(); await app.signedOut(); location.hash = '#/'; },
  async deleteAccount() {
    const uid = app.state.user?.uid;
    if (!uid) return;
    const { deleteCloudData } = await import('./adapters/firebase/sync.js');
    await deleteCloudData(uid);
    const a = await loadAuth();
    try { await a.deleteCurrentUser(); } catch (e) {
      if (e?.code === 'auth/requires-recent-login') { toast('Vuelve a entrar', 'Por seguridad, inicia sesión otra vez y repite el borrado.'); await a.signOutUser(); await app.signedOut(); return; }
      throw e;
    }
    await app.signedOut();
    toast('Cuenta borrada', 'Tus datos en la nube se eliminaron. Los de este dispositivo siguen aquí.');
  },
};

// ---------- Render ----------
function swapView() {
  cleanup();
  cleanup = () => {};
  const old = viewRef;
  const fresh = old.cloneNode(false); // quita listeners anteriores
  old.replaceWith(fresh);
  viewRef = fresh;
  return fresh;
}

// ---------- Historia (paquete independiente de la mecánica) ----------
let storyReady = false;
async function loadStory() {
  await initStory(app.state.profile.storyId);
  storyReady = true;
}
const storyDeps = {
  listPacks,
  /** Cambia de historia: guarda solo el id (y el tema por defecto del paquete) y vuelve a resolver. */
  async switchStory(id) {
    const m = listPacks().find((p) => p.id === id);
    await app.updateProfile({ storyId: id, ...(m?.defaultTheme ? { theme: m.defaultTheme } : {}) });
    await loadStory();
    render();
  },
};

function render() {
  const s = app.state;
  if (!s.derived || !storyReady) return;
  if (s.storyChanged) { s.storyChanged = false; loadStory().then(render); return; }
  const route = parseRoute();
  const step = app.step();
  const onb = step && route.name !== 'privacy' && route.name !== 'sample';
  shell.classList.toggle('onboarding', !!onb || route.name === 'profile');
  if (onb || route.name === 'profile') {
    const v = swapView();
    const st = onb ? step : 'profile';
    v.innerHTML = renderOnboarding(app, st);
    cleanup = bindOnboarding(v, app, st, authDeps, render);
    if (st === 'welcome') authDeps.preloadAuth();
    return;
  }
  hudEl.innerHTML = hud(s);
  document.querySelectorAll('.bottomnav a').forEach((a) => {
    const r = a.dataset.route;
    const on = r === route.name || (r === 'card' && route.name === 'detail') || (r === 'progress' && route.name === 'achievements') || (r === 'menu' && route.name === 'privacy');
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  const v = swapView();
  v.classList.toggle('view-play', route.name === 'card' || route.name === 'sample');
  if (route.name === 'card') { v.innerHTML = renderCard(app); cleanup = bindCard(v, app, { dealt: app.lastDeal }); app.lastDeal = null; }
  else if (route.name === 'sample') { v.innerHTML = renderSample(app, route); cleanup = bindSample(v, app, route); }
  else if (route.name === 'detail') v.innerHTML = renderCardDetail(app, route.id);
  else if (route.name === 'progress') v.innerHTML = renderProgress(app);
  else if (route.name === 'achievements') { v.innerHTML = renderAchievements(app); bindAchievements(v); }
  else if (route.name === 'menu') { v.innerHTML = renderMenu(app); bindMenu(v, app, { ...authDeps, ...storyDeps, editProfile() { startProfileEdit(); location.hash = '#/perfil'; } }); }
  else if (route.name === 'privacy') v.innerHTML = `<div class="page">${renderPrivacy()}<p><a class="btn" href="#/">◀ Volver</a></p></div>`;
  if (lastRoute !== location.hash) { v.scrollTop = 0; lastRoute = location.hash; }
}

app.subscribe(() => {
  // No re-renderizar mientras hay una secuencia de recompensa abierta.
  if (document.querySelector('.overlay:not(.leaving)')) { if (!app.step()) hudEl.innerHTML = hud(app.state); return; }
  render();
});
window.addEventListener('hashchange', render);
window.addEventListener('online', () => { app.state.online = true; app.syncNow(); app.emit(); });
window.addEventListener('offline', () => { app.state.online = false; app.emit(); toast('Sin conexión', 'Todo sigue funcionando; sincronizamos al volver.'); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') app.checkReminder(); });

app.init().then(loadStory).then(() => {
  render();
  if (navigator.onLine) loadAuth().catch((e) => console.warn('[auth]', e));
  app.checkReminder();
  setInterval(() => app.checkReminder(), 60000);
});

// ---------- Service worker (offline-first) ----------
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL }).then((reg) => {
    const ask = (w) => {
      const b = document.createElement('div');
      b.className = 'toasts';
      b.innerHTML = `<div class="toast"><b>Nueva versión</b><button class="btn btn-primary" style="margin-top:6px">Toca para actualizar</button></div>`;
      document.body.appendChild(b);
      b.querySelector('button').onclick = () => w.postMessage({ type: 'SKIP_WAITING' });
    };
    if (reg.waiting && navigator.serviceWorker.controller) ask(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const w = reg.installing;
      w?.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) ask(w); });
    });
  });
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloaded) { reloaded = true; location.reload(); } });
}
