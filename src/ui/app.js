// Controlador de la UI: compone core + adaptadores. La lógica de dominio vive en src/core.
import {
  deriveState, diffState, nextCard, makeEvent, buildExport, eventsToCsv, importExport,
  slotsFor, dueReminder, THEMES, MUSCLE_GROUPS,
} from '../core/index.js';
import { GROUP_NAMES, BADGES, REMINDER_COPY } from './i18n/es.js';
import { toast, download } from './dom.js';
import { playSfx } from './components/sfx.js';
import { track, initAnalytics, setAnalyticsEnabled } from '../adapters/firebase/analytics.js';
import { showReminder, registerPeriodicReminder } from '../adapters/notify-local.js';

export function defaultProfile() {
  const dark = typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches;
  return {
    schemaVersion: 1,
    onboarded: false,
    age13: false,
    theme: dark ? 'medianoche' : 'manana',
    places: [],
    careZones: [],
    dailyGoal: 3,
    sound: false,
    reducedMotion: false,
    analytics: true,
    reminders: { pattern: 'off', customTimes: ['12:00'] },
    levelOverrides: {},
    currentCardId: null,
  };
}

export function createApp({ storage, clock, cards, deckId, leveling, appVersion }) {
  const listeners = new Set();
  const byId = new Map(cards.map((c) => [c.id, c]));
  const s = {
    profile: defaultProfile(),
    events: [],
    derived: null,
    card: null,
    user: null,
    sync: { status: 'idle', lastAt: null, error: null },
    updateReady: null,
    reminderDue: null,
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    notified: [],
    appVersion,
  };

  const emit = () => listeners.forEach((fn) => fn(s));
  const ctx = () => ({ now: clock.now(), tzOffsetMin: clock.tzOffsetMin(), device: 'pwa' });

  function recompute() {
    s.derived = deriveState(s.events, {
      now: clock.now(),
      tzOffsetMin: clock.tzOffsetMin(),
      dailyGoal: s.profile.dailyGoal,
      leveling,
      levelOverrides: s.profile.levelOverrides,
    });
  }

  function pickCard(excludeId) {
    const d = s.derived;
    const c = nextCard(cards, {
      levels: d.levels.byGroup,
      places: s.profile.places,
      careZones: s.profile.careZones,
      recent: d.recent,
      todayGroups: d.todayGroups,
      weekGroups: d.weekGroups,
      excludeId,
      now: clock.now(),
    });
    s.card = c;
    s.profile.currentCardId = c?.id ?? null;
    storage.saveProfile(s.profile);
  }

  function applyTheme() {
    const root = document.documentElement;
    root.dataset.theme = THEMES.includes(s.profile.theme) ? s.profile.theme : 'medianoche';
    root.dataset.reducedMotion = String(!!s.profile.reducedMotion);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(root).getPropertyValue('--bg').trim();
  }

  async function addEvent(type, payload) {
    const e = makeEvent(type, payload, ctx());
    await storage.addEvent(e);
    s.events.push({ ...e, synced: 0 });
    return e;
  }

  function cardIsAllowed(c) {
    return c && !(c.careZones || []).some((z) => s.profile.careZones.includes(z));
  }

  const app = {
    state: s,
    cards,
    byId,
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    emit,

    async init() {
      const saved = await storage.getProfile();
      s.profile = { ...defaultProfile(), ...(saved || {}) };
      s.profile.reminders = { ...defaultProfile().reminders, ...(s.profile.reminders || {}) };
      s.events = await storage.allEvents();
      s.notified = (await storage.getMeta('notified')) || [];
      applyTheme();
      recompute();
      const keep = byId.get(s.profile.currentCardId);
      if (cardIsAllowed(keep)) s.card = keep; else pickCard();
      if (s.profile.onboarded) initAnalytics(s.profile.analytics);
      app.writeReminderState();
      emit();
    },

    /** ¡Listo! → evento + recompensa. Devuelve info para la animación. */
    async done() {
      const c = s.card;
      if (!c) return null;
      const before = s.derived;
      const e = await addEvent('card_done', {
        cardId: c.id, deckId, level: c.level, groups: c.muscleGroups,
        place: s.profile.places.length === 1 ? s.profile.places[0] : null,
        reps: c.dose?.reps ?? null, durationSec: c.dose?.durationSec ?? null,
      });
      recompute();
      const diff = diffState(before, s.derived);
      track('card_done', { card_level: c.level, muscle_group: c.primaryGroup });
      for (const lc of diff.levelChanges) if (lc.to > lc.from) track('level_up', { muscle_group: lc.group, level: lc.to });
      if (s.profile.sound) playSfx(diff.levelChanges.length ? 'nivel' : diff.newBadges.length ? 'logro' : 'listo');
      for (const b of diff.newBadges) toast('¡Insignia desbloqueada!', BADGES[b]?.[0] ?? b, 4500);
      for (const lc of diff.levelChanges) {
        toast(lc.to > lc.from ? '¡Subiste de nivel!' : 'Ajuste de nivel', `${GROUP_NAMES[lc.group]}: nivel ${lc.to}`, 4500);
      }
      s.reminderDue = null;
      app.writeReminderState();
      app.autoSync();
      emit();
      return { event: e, card: c, xp: s.derived.xp - before.xp, diff };
    },

    async rate(refId, effort) {
      await addEvent('effort_rated', { refId, effort });
      recompute();
      app.autoSync();
    },

    next() { pickCard(s.card?.id); emit(); },

    async skip() {
      const c = s.card;
      if (c) {
        await addEvent('card_skipped', { cardId: c.id, deckId, level: c.level, groups: c.muscleGroups });
        track('card_skip', { card_level: c.level, muscle_group: c.primaryGroup });
        if (s.profile.sound) playSfx('otra');
      }
      recompute();
      pickCard(c?.id);
      emit();
    },

    async updateProfile(patch) {
      const prevTheme = s.profile.theme;
      s.profile = { ...s.profile, ...patch };
      await storage.saveProfile(s.profile);
      applyTheme();
      if (patch.theme && patch.theme !== prevTheme) track('theme_change', { theme: patch.theme });
      if ('analytics' in patch) { setAnalyticsEnabled(patch.analytics); if (patch.analytics) initAnalytics(true); }
      if ('careZones' in patch || 'places' in patch) { recompute(); if (!cardIsAllowed(s.card) || 'places' in patch) pickCard(); }
      if ('dailyGoal' in patch || 'levelOverrides' in patch) recompute();
      if ('reminders' in patch) {
        app.writeReminderState();
        registerPeriodicReminder(patch.reminders.pattern !== 'off');
      }
      emit();
    },

    async finishOnboarding(patch) {
      await app.updateProfile({ ...patch, onboarded: true, age13: true });
      initAnalytics(s.profile.analytics);
    },

    exportJson() {
      const data = buildExport({ events: s.events, profile: s.profile, now: clock.now(), appVersion });
      download(`snapfit-progreso-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data, null, 2), 'application/json');
    },
    exportCsv() {
      download(`snapfit-eventos-${new Date().toISOString().slice(0, 10)}.csv`, eventsToCsv(s.events), 'text/csv');
    },
    async importJson(text) {
      const r = importExport(s.events, JSON.parse(text));
      await storage.putEventsIfMissing(r.added, 0);
      s.events = await storage.allEvents();
      recompute();
      emit();
      return r;
    },

    // ---------- cuenta y sincronización ----------
    setUser(u) { s.user = u; emit(); if (u) app.syncNow(); },
    async syncNow() {
      if (!s.user || !navigator.onLine) return;
      s.sync = { ...s.sync, status: 'syncing', error: null };
      emit();
      try {
        const { syncNow } = await import('../adapters/firebase/sync.js');
        const d = s.derived;
        const r = await syncNow({
          uid: s.user.uid, storage,
          derived: { xp: d.xp, levelGlobal: d.levels.global, levelByGroup: d.levels.byGroup, streak: d.streak.current, badges: d.badges },
        });
        s.events = await storage.allEvents();
        recompute();
        s.sync = { status: 'ok', lastAt: Date.now(), error: null, ...r };
      } catch (e) {
        console.warn('[sync]', e);
        s.sync = { status: 'error', lastAt: s.sync.lastAt, error: e?.code || e?.message || String(e) };
      }
      emit();
    },
    autoSync: debounce(() => app.syncNow(), 30000),

    // ---------- recordatorios ----------
    reminderSlots() { return slotsFor(s.profile.reminders.pattern, s.profile.reminders.customTimes); },
    async writeReminderState() {
      await storage.setMeta('reminder', {
        slots: app.reminderSlots(),
        tzOffsetMin: clock.tzOffsetMin(),
        lastDoneTs: s.derived?.lastDoneTs ?? null,
        title: 'SnapFit',
        body: REMINDER_COPY[0],
      });
    },
    async checkReminder() {
      const key = dueReminder({
        now: clock.now(), tzOffsetMin: clock.tzOffsetMin(), slots: app.reminderSlots(),
        lastDoneTs: s.derived?.lastDoneTs, notified: s.notified,
      });
      if (!key) return;
      s.reminderDue = key;
      // Las notificaciones del SW (periodic sync) se registran en meta 'notified' compartida.
      const swNotified = (await storage.getMeta('notified')) || [];
      if (!swNotified.includes(key)) {
        const body = REMINDER_COPY[Math.floor(Math.random() * REMINDER_COPY.length)];
        if (document.visibilityState === 'hidden') await showReminder('SnapFit', body);
      }
      s.notified = [...new Set([...swNotified, ...s.notified, key])].slice(-30);
      await storage.setMeta('notified', s.notified);
      emit();
    },
    dismissReminder() { s.reminderDue = null; emit(); },

    async deleteAllLocal() {
      await storage.clearAll();
      location.reload();
    },
  };
  return app;
}

function debounce(fn, ms) {
  let t = null;
  return () => { clearTimeout(t); t = setTimeout(fn, ms); };
}

export { MUSCLE_GROUPS };
