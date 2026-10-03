// Inicialización perezosa de Firebase (solo se descarga si se usa).
import { firebaseConfig } from './config.js';

let appPromise = null;
export function getFirebaseApp() {
  if (!appPromise) {
    appPromise = import('firebase/app').then(({ initializeApp, getApps }) => getApps()[0] || initializeApp(firebaseConfig));
  }
  return appPromise;
}
