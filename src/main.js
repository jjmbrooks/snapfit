// Composición: core (puro) + adaptadores + UI.
import './ui/styles/tokens.css';
import './ui/styles/themes.css';
import './ui/styles/base.css';
import cards from '../content/cards/adulto-general.draft.json';
import leveling from '../content/leveling.json';
import { storage } from './adapters/storage-idb.js';
import { clock } from './adapters/clock.js';
import { createApp } from './ui/app.js';
import { parseRoute } from './ui/router.js';
import { renderCard, bindCard, renderCardDetail, hud } from './ui/views/card.js';
import { renderProgress } from './ui/views/progress.js';
import { renderAchievements, bindAchievements } from './ui/views/achievements.js';
import { renderMenu, bindMenu } from './ui/views/menu.js';
import { renderPrivacy } from './ui/views/privacy.js';
import { showOnboarding } from './ui/views/onboarding.js';
import { toast } from './ui/dom.js';

const APP_VERSION = __APP_VERSION__;
const AUTH_FLAG = 'snapfit.auth';

const app = createApp({ storage, clock, cards, deckId: 'adulto-general', leveling, appVersion: APP_VERSION });

let viewRef = document.getElementById('view');
const hudEl = document.getElementById('hud');
let cleanup = () => {};
let lastRoute = null;

// ---------- Auth (perezoso: solo si el usuario la usa) ----------
let authApi = null;
async function loadAuth() {
  if (!authApi) {
    authApi = await import('./adapters/firebase/auth.js');
    await authApi.watchAuth((u) => {
      if (u) localStorage.setItem(AUTH_FLAG, '1'); else localStorage.removeItem(AUTH_FLAG);
      app.setUser(u);
    });
  }
  return authApi;
}
const authDeps = {
  preloadAuth() { import('./adapters/firebase/auth.js').catch(() => {}); },
  async signIn() { const a = await loadAuth(); await a.signInWithGoogle(); },
  async signOut() { const a = await loadAuth(); await a.signOutUser(); },
  async deleteAccount() {
    const uid = app.state.user?.uid;
    if (!uid) return;
    const { deleteCloudData } = await import('./adapters/firebase/sync.js');
    await deleteCloudData(uid);
    const a = await loadAuth();
    try { await a.deleteCurrentUser(); } catch (e) {
      if (e?.code === 'auth/requires-recent-login') { toast('Vuelve a entrar', 'Por seguridad, inicia sesión otra vez y repite el borrado.'); await a.signOutUser(); return; }
      throw e;
    }
    toast('Cuenta borrada', 'Tus datos en la nube se eliminaron. Los de este dispositivo siguen aquí.');
  },
};

// ---------- Render ----------
function render() {
  const s = app.state;
  if (!s.derived) return;
  const route = parseRoute();
  hudEl.innerHTML = hud(s, true);
  document.querySelectorAll('.bottomnav a').forEach((a) => {
    const r = a.dataset.route;
    const on = r === route.name || (r === 'card' && route.name === 'detail') || (r === 'progress' && route.name === 'achievements') || (r === 'menu' && route.name === 'privacy');
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  cleanup();
  cleanup = () => {};
  const old = viewRef;
  const fresh = old.cloneNode(false); // quita listeners anteriores
  old.replaceWith(fresh);
  viewRef = fresh;
  if (route.name === 'card') { fresh.innerHTML = renderCard(app); cleanup = bindCard(fresh, app); }
  else if (route.name === 'detail') fresh.innerHTML = renderCardDetail(app, route.id);
  else if (route.name === 'progress') fresh.innerHTML = renderProgress(app);
  else if (route.name === 'achievements') { fresh.innerHTML = renderAchievements(app); bindAchievements(fresh); }
  else if (route.name === 'menu') { fresh.innerHTML = renderMenu(app); bindMenu(fresh, app, authDeps); }
  else if (route.name === 'privacy') fresh.innerHTML = renderPrivacy();
  if (lastRoute !== location.hash) { window.scrollTo(0, 0); lastRoute = location.hash; }
  if (!s.profile.onboarded && route.name !== 'privacy' && !document.querySelector('.onb')) showOnboarding(app);
}

app.subscribe(() => {
  // No re-renderizar la vista de carta mientras hay un modal de recompensa abierto.
  if (document.querySelector('.overlay:not(.onb)')) { hudEl.innerHTML = hud(app.state, true); return; }
  render();
});
window.addEventListener('hashchange', render);
window.addEventListener('online', () => { app.state.online = true; app.syncNow(); app.emit(); });
window.addEventListener('offline', () => { app.state.online = false; app.emit(); toast('Sin conexión', 'Todo sigue funcionando; sincronizamos al volver.'); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') app.checkReminder(); });

app.init().then(() => {
  if (localStorage.getItem(AUTH_FLAG) === '1' && navigator.onLine) loadAuth().catch((e) => console.warn('[auth]', e));
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
