/* SnapFit service worker (escrito a mano, ADR-004). El build inyecta la lista de precache. */
const VERSION = '__SW_VERSION__';
const PRECACHE = __PRECACHE_MANIFEST__;
const CACHE = `snapfit-${VERSION}`;
const scopeUrl = (p) => new URL(p, self.registration.scope).href;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(['./', ...PRECACHE].map(scopeUrl))),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const k of await caches.keys()) if (k.startsWith('snapfit-') && k !== CACHE) await caches.delete(k);
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  // Paquete de historia activo: cachea sus assets y borra los de paquetes anteriores.
  if (event.data?.type === 'CACHE_STORY') event.waitUntil(cacheStory(event.data.id, event.data.urls || []));
});

const STORY_PREFIX = 'snapstory-'; // no empieza con 'snapfit-': sobrevive a las actualizaciones del SW
async function cacheStory(id, urls) {
  const name = STORY_PREFIX + id;
  for (const k of await caches.keys()) if (k.startsWith(STORY_PREFIX) && k !== name) await caches.delete(k);
  const c = await caches.open(name);
  for (const u of urls) {
    const abs = scopeUrl(u);
    if (!(await c.match(abs))) await c.add(abs).catch(() => {}); // best effort, sin red no pasa nada
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Firebase/Google: siempre red
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match(scopeUrl('./')).then((r) => r || fetch(req)).catch(() => caches.match(scopeUrl('index.html'))),
    );
    return;
  }
  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          const scopePath = new URL(self.registration.scope).pathname;
          // Los assets de historia solo se cachean vía CACHE_STORY (paquete activo), no al vuelo.
          if (res.ok && url.pathname.startsWith(scopePath) && !url.pathname.startsWith(scopePath + 'stories/')) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        }),
    ),
  );
});

// ---------- Recordatorios (Periodic Background Sync, best effort) ----------
function idb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open('snapfit', 1);
    r.onupgradeneeded = () => {
      const db = r.result;
      if (!db.objectStoreNames.contains('profile')) db.createObjectStore('profile');
      if (!db.objectStoreNames.contains('events')) db.createObjectStore('events', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta');
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
function metaGet(db, key) {
  return new Promise((res, rej) => {
    const r = db.transaction('meta').objectStore('meta').get(key);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
function metaSet(db, key, val) {
  return new Promise((res, rej) => {
    const t = db.transaction('meta', 'readwrite');
    t.objectStore('meta').put(val, key);
    t.oncomplete = () => res();
    t.onerror = () => rej(t.error);
  });
}
// Copia mínima de core/schedule.dueReminder (el SW no importa módulos del bundle).
function due(now, tz, slots, lastDoneTs, notified) {
  const local = new Date(now + tz * 60000);
  const today = local.toISOString().slice(0, 10);
  const nowMin = local.getUTCHours() * 60 + local.getUTCMinutes();
  for (const s of [...slots].sort().reverse()) {
    const [h, m] = s.split(':').map(Number);
    const sm = h * 60 + m;
    if (nowMin < sm || nowMin - sm > 180) continue;
    const key = `${today}@${s}`;
    if (notified.includes(key)) return null;
    if (lastDoneTs != null) {
      const ld = new Date(lastDoneTs + tz * 60000);
      if (ld.toISOString().slice(0, 10) === today && ld.getUTCHours() * 60 + ld.getUTCMinutes() >= sm) return null;
    }
    return key;
  }
  return null;
}
async function checkReminder() {
  const db = await idb();
  const st = await metaGet(db, 'reminder');
  if (!st || !st.slots?.length) return;
  const notified = (await metaGet(db, 'notified')) || [];
  const key = due(Date.now(), st.tzOffsetMin || 0, st.slots, st.lastDoneTs, notified);
  if (!key) return;
  const clientsList = await self.clients.matchAll({ type: 'window' });
  if (clientsList.some((c) => c.visibilityState === 'visible')) return; // la app muestra su aviso
  await self.registration.showNotification(st.title || 'SnapFit', {
    body: st.body || 'Tu mazo te espera: una carta y listo.',
    icon: scopeUrl('icons/icon-192.png'),
    badge: scopeUrl('icons/icon-192.png'),
    tag: 'snapfit-reminder',
  });
  await metaSet(db, 'notified', [...notified, key].slice(-30));
}
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'snapfit-reminder') event.waitUntil(checkReminder());
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const c of list) if ('focus' in c) return c.focus();
      return self.clients.openWindow(self.registration.scope);
    })(),
  );
});
