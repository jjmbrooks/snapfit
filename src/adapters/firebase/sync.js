// SyncPort → Firestore users/{uid}/events/{eventId} (docs/02-ARCHITECTURE.md §4 y §7).
// Push idempotente (id del doc = id del evento) + pull por serverAt.
import { getFirebaseApp } from './app.js';
import { validateEvent, stripLocal } from '../../core/index.js';

let fs = null;
let db = null;

async function load() {
  if (db) return db;
  const app = await getFirebaseApp();
  fs = await import('firebase/firestore');
  try {
    db = fs.initializeFirestore(app, { ignoreUndefinedProperties: true });
  } catch {
    db = fs.getFirestore(app);
  }
  return db;
}

const clean = (o) => JSON.parse(JSON.stringify(o)); // quita undefined

/**
 * @param {{uid:string, storage:object, derived?:object}} p
 * @returns {Promise<{pushed:number, pulled:number}>}
 */
export async function syncNow({ uid, storage, derived }) {
  const d = await load();
  const all = await storage.allEvents();
  const pending = all.filter((e) => !e.synced && !validateEvent(stripLocal(e)));

  // 1) push en lotes de ≤ 450
  let pushed = 0;
  for (let i = 0; i < pending.length; i += 450) {
    const chunk = pending.slice(i, i + 450);
    const batch = fs.writeBatch(d);
    for (const e of chunk) {
      batch.set(fs.doc(d, 'users', uid, 'events', e.id), { ...clean(stripLocal(e)), serverAt: fs.serverTimestamp() });
    }
    await batch.commit();
    await storage.markSynced(chunk.map((e) => e.id));
    pushed += chunk.length;
  }

  // 2) pull de otros dispositivos
  const meta = (await storage.getMeta('sync')) || {};
  const lastPullMs = meta.uid === uid ? meta.lastPullMs || 0 : 0;
  const q = fs.query(
    fs.collection(d, 'users', uid, 'events'),
    fs.where('serverAt', '>', fs.Timestamp.fromMillis(lastPullMs)),
    fs.orderBy('serverAt'),
  );
  const snap = await fs.getDocs(q);
  let maxMs = lastPullMs;
  const incoming = [];
  snap.forEach((doc) => {
    const { serverAt, ...e } = doc.data();
    if (serverAt?.toMillis) maxMs = Math.max(maxMs, serverAt.toMillis());
    if (!validateEvent(e)) incoming.push(e);
  });
  const pulled = await storage.putEventsIfMissing(incoming, 1);
  await storage.setMeta('sync', { uid, lastPullMs: maxMs, lastSyncAt: Date.now() });

  // 3) caché derivada (no es fuente de verdad)
  if (derived) {
    await fs.setDoc(
      fs.doc(d, 'users', uid),
      { schemaVersion: 1, derived: clean({ ...derived, updatedAt: Date.now() }) },
      { merge: true },
    );
  }
  return { pushed, pulled };
}

/** Borra users/{uid}/** desde el cliente (para «Borrar mi cuenta»). */
export async function deleteCloudData(uid) {
  const d = await load();
  const snap = await fs.getDocs(fs.collection(d, 'users', uid, 'events'));
  let batch = fs.writeBatch(d);
  let n = 0;
  for (const docSnap of snap.docs) {
    batch.delete(docSnap.ref);
    if (++n % 450 === 0) { await batch.commit(); batch = fs.writeBatch(d); }
  }
  await batch.commit();
  await fs.deleteDoc(fs.doc(d, 'users', uid));
}

/** Guarda el perfil del jugador en users/{uid}.profile (merge). */
export async function saveCloudProfile(uid, profile) {
  const d = await load();
  await fs.setDoc(fs.doc(d, 'users', uid), { schemaVersion: 1, profile: clean({ ...profile, updatedAt: Date.now() }) }, { merge: true });
}

/** Lee users/{uid}.profile (o null). */
export async function fetchCloudProfile(uid) {
  const d = await load();
  const snap = await fs.getDoc(fs.doc(d, 'users', uid));
  return snap.exists() ? snap.data().profile || null : null;
}
