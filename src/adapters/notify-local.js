// NotifyPort: recordatorios locales (docs/02-ARCHITECTURE.md §8).
// 1) Notification API con la app abierta, 2) Periodic Background Sync (best effort), 3) aviso dentro de la app.

export function notificationSupport() {
  return {
    notifications: typeof Notification !== 'undefined',
    permission: typeof Notification !== 'undefined' ? Notification.permission : 'unsupported',
    periodicSync: typeof navigator !== 'undefined' && 'serviceWorker' in navigator && typeof window !== 'undefined' && 'PeriodicSyncManager' in window,
  };
}

export async function requestPermission() {
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.requestPermission();
}

export async function showReminder(title, body) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return false;
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) {
      await reg.showNotification(title, { body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: 'snapfit-reminder' });
    } else {
      new Notification(title, { body, tag: 'snapfit-reminder' });
    }
    return true;
  } catch (e) {
    console.warn('[notify]', e);
    return false;
  }
}

/** Registra Periodic Background Sync si el navegador lo permite (PWA instalada). */
export async function registerPeriodicReminder(enabled) {
  try {
    const reg = await navigator.serviceWorker?.ready;
    if (!reg || !('periodicSync' in reg)) return 'unsupported';
    if (!enabled) { await reg.periodicSync.unregister('snapfit-reminder'); return 'off'; }
    const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
    if (status.state !== 'granted') return 'denied';
    await reg.periodicSync.register('snapfit-reminder', { minInterval: 60 * 60 * 1000 });
    return 'registered';
  } catch (e) {
    return 'unsupported';
  }
}
