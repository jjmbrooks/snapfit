// StoragePort → IndexedDB 'snapfit' (docs/02-ARCHITECTURE.md §3).
const DB_NAME = 'snapfit';
const DB_VERSION = 1;

let dbPromise = null;

export function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('profile')) db.createObjectStore('profile');
      if (!db.objectStoreNames.contains('events')) db.createObjectStore('events', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx(store, mode, fn) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const t = db.transaction(store, mode);
        const s = t.objectStore(store);
        let result;
        Promise.resolve(fn(s)).then((r) => (result = r));
        t.oncomplete = () => resolve(result);
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error);
      }),
  );
}

const req2p = (r) => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });

export const storage = {
  async getProfile() {
    return tx('profile', 'readonly', (s) => req2p(s.get('me')));
  },
  async saveProfile(p) {
    return tx('profile', 'readwrite', (s) => { s.put(p, 'me'); });
  },
  async allEvents() {
    const list = await tx('events', 'readonly', (s) => req2p(s.getAll()));
    return (list || []).sort((a, b) => (a.id < b.id ? -1 : 1));
  },
  async addEvent(e) {
    return tx('events', 'readwrite', (s) => { s.put({ ...e, synced: 0 }); });
  },
  /** Inserta eventos que no existan (idempotente). */
  async putEventsIfMissing(events, synced = 1) {
    return tx('events', 'readwrite', async (s) => {
      let added = 0;
      for (const e of events) {
        const existing = await req2p(s.get(e.id));
        if (!existing) { s.put({ ...e, synced }); added++; }
      }
      return added;
    });
  },
  async markSynced(ids) {
    return tx('events', 'readwrite', async (s) => {
      for (const id of ids) {
        const e = await req2p(s.get(id));
        if (e) s.put({ ...e, synced: 1 });
      }
    });
  },
  async getMeta(key) {
    return tx('meta', 'readonly', (s) => req2p(s.get(key)));
  },
  async setMeta(key, value) {
    return tx('meta', 'readwrite', (s) => { s.put(value, key); });
  },
  async clearAll() {
    for (const st of ['profile', 'events', 'meta']) await tx(st, 'readwrite', (s) => { s.clear(); });
  },
};
