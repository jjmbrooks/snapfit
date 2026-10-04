// Controlador de la UI: compone core + adaptadores. La lógica de dominio vive en src/core.
import {
  deriveState, diffState, makeEvent, buildExport, eventsToCsv, importExport,
  slotsFor, dueReminder, THEMES, MUSCLE_GROUPS,
  syncDeck, topCard, sendToBottom, discardTop,
  validateProfile, recommendDeck, initialLevels,
} from '../core/index.js';
import { REMINDER_COPY } from './i18n/es.js';
import { download } from './dom.js';
import { playSfx } from './components/sfx.js';
import { track, initAnalytics, setAnalyticsEnabled } from '../adapters/firebase/analytics.js';
import { showReminder, registerPeriodicReminder } from '../adapters/notify-local.js';

export function defaultProfile() {
  const dark = typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches;
  return {
    schemaVersion: 2,
    accountUid: null, // se fija tras el primer login con Google; luego la app abre aunque no haya red
    player: null, // { age, sex, fitness, test, deckId, baseLevels }
    termsAt: null,
    theme: dark ? 'medianoche' : 'manana',
    places: [],
    careZones: [],
    dailyGoal: 3,
    sound: false,
    reducedMotion: false,
    analytics: true,
    reminders: { pattern: 'off', customTimes: ['12:00'] },
    levelOverrides: {},
    storyId: null, // id del paquete de historia elegido (null = el por defecto). Solo el id, nunca textos.
  };
}

/** Paso pendiente del onboarding o null si ya puede jugar. */
export function onboardingStep(p) {
  if (!p.accountUid) return 'welcome';
  if (!p.player || validateProfile(p.player)) return 'profile';
  if (!p.termsAt) return 'terms';
  return null;
}

export function createApp({ storage, clock, cards, decks, leveling, appVersion }) {
  const listeners = new Set();
  const byId = new Map(cards.map((c) => [c.id, c]));
  const deckIds = decks.map((d) => d.id);
  const s = {
    profile: defaultProfile(),
    events: [],
    derived: null,
    deck: null,
    card: null,
    user: null,
    sync: { status: 'idle', lastAt: null, error: null },
    reminderDue: null,
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    notified: [],
    appVersion,
  };

  const emit = () => listeners.forEach((fn) => fn(s));
  const ctx = () => ({ now: clock.now(), tzOffsetMin: clock.tzOffsetMin(), device: 'pwa' });
  const deckId = () => s.profile.player?.deckId || 'adulto-general';
  const deckCards = () => {
    const id = deckId();
    const list = cards.filter((c) => (c.decks || []).includes(id));
    return list.length ? list : cards;
  };

  function recompute() {
    s.derived = deriveState(s.events, {
      now: clock.now(),
      tzOffsetMin: clock.tzOffsetMin(),
      dailyGoal: s.profile.dailyGoal,
      leveling,
      levelOverrides: s.profile.levelOverrides,
      baseLevels: s.profile.player?.baseLevels,
    });
  }

  function engineCtx() {
    const d = s.derived;
    return {
      levels: d.levels.byGroup, places: s.profile.places, careZones: s.profile.careZones,
      recent: d.recent, todayGroups: d.todayGroups, weekGroups: d.weekGroups, now: clock.now(),
    };
  }

  function refreshDeck() {
    s.deck = syncDeck(deckCards(), engineCtx(), s.deck, Math.random);
    s.card = byId.get(topCard(s.deck)) || null;
    storage.setMeta('deck', s.deck);
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

  async function saveProfile() {
    await storage.saveProfile(s.profile);
  }

  async function pushCloudProfile() {
    if (!s.user || !s.profile.player || !navigator.onLine) return;
    try {
      const { saveCloudProfile } = await import('../adapters/firebase/sync.js');
      const { age, sex, fitness, test, deckId: dk, baseLevels } = s.profile.player;
      await saveCloudProfile(s.user.uid, { age, sex, fitness, test, deckId: dk, baseLevels, termsAt: s.profile.termsAt });
    } catch (e) {
      console.warn('[perfil nube]', e?.code || e);
    }
  }

  const app = {
    state: s,
    cards,
    byId,
    decks,
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    emit,
    step: () => onboardingStep(s.profile),

    async init() {
      const saved = await storage.getProfile();
      s.profile = { ...defaultProfile(), ...(saved || {}) };
      s.profile.reminders = { ...defaultProfile().reminders, ...(s.profile.reminders || {}) };
      s.events = await storage.allEvents();
      s.notified = (await storage.getMeta('notified')) || [];
      s.deck = (await storage.getMeta('deck')) || null;
      applyTheme();
      recompute();
      refreshDeck();
      if (!app.step()) initAnalytics(s.profile.analytics);
      app.writeReminderState();
      emit();
    },

    // ---------- onboarding ----------
    /** Tras el login con Google: vincula la cuenta y recupera el perfil de la nube si existe. */
    async linkAccount(user) {
      const changed = s.profile.accountUid !== user.uid;
      s.profile.accountUid = user.uid;
      if (changed || !s.profile.player) {
        try {
          const { fetchCloudProfile } = await import('../adapters/firebase/sync.js');
          const remote = await fetchCloudProfile(user.uid);
          if (remote && !validateProfile(remote)) {
            const { termsAt, updatedAt, ...player } = remote;
            s.profile.player = { ...player, ...derivePlayer(player) };
            s.profile.termsAt = termsAt || s.profile.termsAt;
          }
          const { fetchCloudSettings } = await import('../adapters/firebase/sync.js');
          const st = await fetchCloudSettings(user.uid);
          if (st && 'storyId' in st && st.storyId !== s.profile.storyId) { s.profile.storyId = st.storyId; s.storyChanged = true; }
          if (st?.theme && THEMES.includes(st.theme)) s.profile.theme = st.theme;
        } catch (e) {
          console.warn('[perfil nube] no disponible', e?.code || e);
        }
      }
      await saveProfile();
      recompute();
      refreshDeck();
      emit();
    },

    previewPlayer(player) {
      return derivePlayer(player);
    },

    async setPlayer(player) {
      const err = validateProfile(player);
      if (err) throw new Error(err);
      s.profile.player = { ...player, ...derivePlayer(player) };
      await saveProfile();
      recompute();
      s.deck = null; // nuevo mazo para el nuevo perfil
      refreshDeck();
      pushCloudProfile();
      emit();
    },

    async acceptTerms({ analytics }) {
      s.profile.termsAt = new Date(clock.now()).toISOString();
      s.profile.analytics = !!analytics;
      await saveProfile();
      pushCloudProfile();
      initAnalytics(s.profile.analytics);
      emit();
    },

    // ---------- mecánica de mazo ----------
    /** «Listo»: registra, descarta la carta y devuelve datos para la secuencia de felicitación. */
    async done() {
      const c = s.card;
      if (!c) return null;
      const before = s.derived;
      const e = await addEvent('card_done', {
        cardId: c.id, deckId: deckId(), level: c.level, groups: c.muscleGroups,
        place: s.profile.places.length === 1 ? s.profile.places[0] : null,
        reps: c.dose?.reps ?? null, durationSec: c.dose?.durationSec ?? null,
      });
      recompute();
      const diff = diffState(before, s.derived);
      s.deck = discardTop(deckCards(), engineCtx(), s.deck, Math.random);
      refreshDeck();
      track('card_done', { card_level: c.level, muscle_group: c.primaryGroup });
      for (const lc of diff.levelChanges) if (lc.to > lc.from) track('level_up', { muscle_group: lc.group, level: lc.to });
      if (s.profile.sound) playSfx(diff.levelChanges.length ? 'nivel' : diff.newBadges.length ? 'logro' : 'listo');
      s.reminderDue = null;
      app.writeReminderState();
      app.autoSync();
      return { event: e, card: c, xp: s.derived.xp - before.xp, diff, before, after: s.derived };
    },

    async rate(refId, effort) {
      await addEvent('effort_rated', { refId, effort });
      recompute();
      app.autoSync();
    },

    /** «Otro»: la carta va al fondo del mazo y se muestra la siguiente. */
    async skip() {
      const c = s.card;
      if (c) {
        await addEvent('card_skipped', { cardId: c.id, deckId: deckId(), level: c.level, groups: c.muscleGroups });
        track('card_skip', { card_level: c.level, muscle_group: c.primaryGroup });
        if (s.profile.sound) playSfx('otra');
      }
      recompute();
      s.deck = sendToBottom(s.deck);
      refreshDeck();
      emit();
    },

    deckSize: () => (s.deck ? s.deck.draw.length + s.deck.discard.length : 0),

    async updateProfile(patch) {
      const prevTheme = s.profile.theme;
      if (('storyId' in patch || 'theme' in patch) && s.user && navigator.onLine) {
        import('../adapters/firebase/sync.js')
          .then(({ saveCloudSettings }) => saveCloudSettings(s.user.uid, { storyId: 'storyId' in patch ? patch.storyId : s.profile.storyId, theme: patch.theme ?? s.profile.theme }))
          .catch((e) => console.warn('[ajustes nube]', e?.code || e));
      }
      s.profile = { ...s.profile, ...patch };
      await saveProfile();
      applyTheme();
      if (patch.theme && patch.theme !== prevTheme) track('theme_change', { theme: patch.theme });
      if ('analytics' in patch) { setAnalyticsEnabled(patch.analytics); if (patch.analytics) initAnalytics(true); }
      if ('careZones' in patch || 'places' in patch || 'dailyGoal' in patch || 'levelOverrides' in patch) { recompute(); refreshDeck(); }
      if ('reminders' in patch) {
        app.writeReminderState();
        registerPeriodicReminder(patch.reminders.pattern !== 'off');
      }
      emit();
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
    async setUser(u) {
      s.user = u;
      if (u) await app.linkAccount(u);
      emit();
      if (u) { app.syncNow(); pushCloudProfile(); }
    },
    async signedOut() {
      s.user = null;
      s.profile.accountUid = null;
      await saveProfile();
      emit();
    },
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
      if (app.step()) return;
      const key = dueReminder({
        now: clock.now(), tzOffsetMin: clock.tzOffsetMin(), slots: app.reminderSlots(),
        lastDoneTs: s.derived?.lastDoneTs, notified: s.notified,
      });
      if (!key) return;
      s.reminderDue = key;
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

  function derivePlayer(player) {
    const rec = recommendDeck(player, deckIds);
    return { deckId: rec.deckId, deckReason: rec.reason, adjustments: rec.adjustments, baseLevels: initialLevels(player) };
  }

  return app;
}

function debounce(fn, ms) {
  let t = null;
  return () => { clearTimeout(t); t = setTimeout(fn, ms); };
}

export { MUSCLE_GROUPS };
