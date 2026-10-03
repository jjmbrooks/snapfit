// AuthPort → Google Sign-In (popup, con redirect como alternativa).
import { getFirebaseApp } from './app.js';

let authMod = null;
let auth = null;

async function load() {
  if (auth) return auth;
  const app = await getFirebaseApp();
  authMod = await import('firebase/auth');
  auth = authMod.getAuth(app);
  auth.languageCode = 'es';
  return auth;
}

/** Suscribe a cambios de sesión. cb(user|null) con {uid, displayName, photoURL}. */
export async function watchAuth(cb) {
  const a = await load();
  try { await authMod.getRedirectResult(a); } catch (e) { console.warn('[auth] redirect', e?.code); }
  return authMod.onAuthStateChanged(a, (u) => cb(u ? { uid: u.uid, displayName: u.displayName, email: u.email } : null));
}

export async function signInWithGoogle() {
  const a = await load();
  const provider = new authMod.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    return await authMod.signInWithPopup(a, provider);
  } catch (e) {
    const fallback = ['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment', 'auth/web-storage-unsupported'];
    if (fallback.includes(e?.code)) return authMod.signInWithRedirect(a, provider);
    throw e;
  }
}

export async function signOutUser() {
  const a = await load();
  return authMod.signOut(a);
}

export async function deleteCurrentUser() {
  const a = await load();
  if (a.currentUser) await authMod.deleteUser(a.currentUser);
}
