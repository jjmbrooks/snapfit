# 02: Arquitectura

## 1. Stack

| Capa | Elección | Nota |
|------|----------|------|
| Build | **Vite** | `base: '/snapfit/'` (GitHub Pages de proyecto) |
| UI | **JS vanilla** (ES modules) + **tokens CSS** | Tailwind es opcional (igual que en astropark-physics); los tokens viven en `src/ui/styles/tokens.css` |
| Animación | Sprite sheets PNG + **Canvas 2D** o CSS `steps()` | `image-rendering: pixelated` |
| Router | Hash router propio | `#/`, `#/progreso`, `#/menu`, … |
| PWA | **SW escrito a mano** (`src/sw/sw.js`) + plugin de build propio en `vite.config.js` que inyecta la lista de precache | ADR-004 (decidido en F1) |
| Almacenamiento local | **IndexedDB** (envoltura mínima propia, `src/adapters/storage-idb.js`) | Fuente de verdad local |
| Nube (opcional) | **Firebase** plan Spark: Auth (Google) + Firestore + Analytics mínimo | SDK modular, carga diferida, chunks `firebase-*` fuera del precache |
| Tests | **Vitest** para `src/core/` | El core se prueba sin DOM |
| Deploy | GitHub Actions → Pages | Basado en `astropark-physics/docs/github-pages.workflow.yml` |

## 2. Carpetas (objetivo de F1)

```
snapfit/
├─ index.html
├─ vite.config.js            # base '/snapfit/'
├─ public/
│  ├─ manifest.webmanifest   # (o lo genera vite-plugin-pwa)
│  └─ assets/{sprites,icons,badges,sfx}/   # todo registrado en docs/ASSETS-PROVENANCE.md
├─ content/
│  ├─ cards/*.json           # una carta por archivo o un JSON por mazo (ver 03)
│  └─ decks/*.json           # adulto-general, ninos, mayores…
├─ src/
│  ├─ core/                  # ★ JS PURO: sin DOM, sin Firebase, sin window
│  │  ├─ deck-engine.js      # selección de la siguiente carta
│  │  ├─ leveling.js         # nivel global y por grupo
│  │  ├─ streaks.js          # racha, comodín, meta diaria
│  │  ├─ xp.js
│  │  ├─ achievements.js     # reglas → insignias desbloqueadas
│  │  ├─ schedule.js         # patrón de recordatorios (cálculo puro)
│  │  ├─ events.js           # tipos de evento + validación
│  │  └─ index.js            # API pública del core (útil para «Mi día»)
│  ├─ adapters/              # implementaciones de puertos
│  │  ├─ storage-idb.js      # StoragePort → IndexedDB
│  │  ├─ storage-memory.js   # para tests
│  │  ├─ sync-firestore.js   # SyncPort → Firestore (carga perezosa)
│  │  ├─ auth-firebase.js    # AuthPort → Google Sign-In
│  │  ├─ notify-local.js     # NotifyPort → Notification API / SW
│  │  └─ clock.js            # ClockPort (inyectable en tests)
│  ├─ ui/
│  │  ├─ router.js
│  │  ├─ views/{card,progress,achievements,menu,onboarding}.js
│  │  ├─ components/         # sprite-player, pixel-button, progress-dots…
│  │  └─ styles/{tokens.css,themes.css,base.css}
│  ├─ sw.js                  # si el SW se escribe a mano
│  └─ main.js                # composición: core + adapters + ui
└─ tests/core/*.test.js
```

**Regla:** `src/core/**` no importa nada de `src/ui`, `src/adapters` ni `firebase`. Las dependencias se inyectan por puertos (interfaces documentadas con JSDoc). Así el core se puede reutilizar como módulo *Cuerpo* de «Mi día».

## 3. Modelo de datos (local, IndexedDB `snapfit`)

Las claves de `localStorage` (solo flags pequeñas) llevan el prefijo `snapfit.`.

| Store | Clave | Contenido |
|-------|-------|-----------|
| `profile` | `'me'` | `{ schemaVersion, birthYearConfirmed13: true, theme, places[], careZones[], activeDeck, dailyGoal, sound, reducedMotion, reminders: {pattern, times[]}, levelOverrides: {group: n} }` |
| `events` | `id` (ULID) | Registro de eventos **solo-anexar** (ver abajo) |
| `state` | `'derived'` | Caché recalculable: `{ xp, levelGlobal, levelByGroup, streak, lastActiveDay, badges[] }` |
| `syncMeta` | `'cursor'` | `{ lastPushedEventId, lastPullAt, uid }` |

**Evento** (inmutable, idempotente):

```json
{
  "id": "01J9Z8...ULID",
  "type": "card_done | card_skipped | effort_rated | level_changed | badge_unlocked | settings_changed",
  "ts": "2026-10-03T18:20:00.000Z",
  "tzOffsetMin": -360,
  "cardId": "sentadilla-silla-l1",
  "deckId": "adulto-general",
  "level": 1,
  "groups": ["piernas", "gluteos"],
  "effort": "facil | bien | duro | null",
  "durationSec": 40,
  "reps": 12,
  "place": "casa | oficina | parque | aula | null",
  "refId": "(solo effort_rated) id del card_done calificado",
  "device": "pwa-android",
  "v": 1
}
```

El estado derivado (`state`) **siempre** se puede reconstruir aplicando los eventos con funciones puras del core. Así la sincronización se simplifica a «unir conjuntos de eventos por `id`».

## 4. Firestore (plan Spark)

### 4.1 Schema

```
users/{uid}                              # documento de perfil
  displayName, createdAt, schemaVersion,
  settings: { …mismo shape que profile local, sin datos sensibles… }
  derived:  { xp, levelGlobal, levelByGroup, streak, badges[] , updatedAt }   # caché, no fuente de verdad

users/{uid}/events/{eventId}             # 1 doc por evento (id = ULID local → idempotente)
  …campos del evento… , serverAt: serverTimestamp()

users/{uid}/exports/{yyyy-mm}            # (opcional, F3) snapshot mensual comprimido para export
```

Presupuesto Spark (50 mil lecturas y 20 mil escrituras diarias): un usuario hace unos 10 eventos al día, muy por debajo del límite. Las escrituras se agrupan con `writeBatch` (hasta 500).

### 4.2 Reglas de seguridad

La versión vigente es **`firestore.rules`** en la raíz del repo (con `firebase.json` y `.firebaserc` → `snapfit-c7beb`). Diferencias respecto al borrador de abajo: valida `serverAt == request.time`, el tamaño del doc, y permite un `update` que **solo** cambie `serverAt` (para que el push sea idempotente en reintentos). **Desplegar:** `firebase deploy --only firestore:rules` (requiere el login de Brooks; pendiente). Borrador original:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function signedIn() { return request.auth != null; }
    function isOwner(uid) { return signedIn() && request.auth.uid == uid; }

    match /users/{uid} {
      allow read: if isOwner(uid);
      allow create, update: if isOwner(uid)
        && request.resource.data.keys().hasOnly(['displayName','createdAt','schemaVersion','settings','derived']);
      allow delete: if isOwner(uid);

      match /events/{eventId} {
        allow read: if isOwner(uid);
        // solo-anexar: se crea, no se edita
        allow create: if isOwner(uid)
          && request.resource.data.id == eventId
          && request.resource.data.type in ['card_done','card_skipped','effort_rated','level_changed','badge_unlocked','settings_changed']
          && request.resource.data.v is int;
        allow update: if false;
        allow delete: if isOwner(uid);   // borrar mi cuenta y mis datos
      }

      match /exports/{docId} {
        allow read, write: if isOwner(uid);
      }
    }
    match /{document=**} { allow read, write: if false; }
  }
}
```

- El `firebaseConfig` web **no es secreto**. Brooks lo pegará en `src/adapters/firebase-config.js`. Las reglas son la protección real.
- En la consola: activar solo el proveedor **Google**, agregar `jjmbrooks.github.io` a los dominios autorizados y, opcionalmente, App Check en una fase posterior.
- **Borrar mi cuenta** (Menú) elimina `users/{uid}/**` desde el cliente y después borra el usuario de Auth.

## 5. Nivelación (core `leveling.js`)

Los criterios concretos los entrega **Entrenador** en `docs/training/`. El motor es **configurable por datos** (`content/leveling.json`) para no recodificar cuando cambien los criterios.

Heurística inicial, sujeta a validación de Entrenador:

- Cada grupo muscular tiene un nivel de 1 a 10. Al empezar todos están en nivel 1, o en el que resulte de una carta de prueba opcional.
- **Subir**: N cartas completadas del grupo en el nivel actual, repartidas en al menos D días distintos, con al menos P % marcadas «fácil» o «bien» y ninguna «duro» reciente.
- **Bajar o sugerir variante fácil**: varios «duro» o saltos consecutivos en un grupo.
- **Nivel global**: función del promedio de los niveles por grupo y de la constancia.
- La app **propone** el cambio y el usuario confirma o fija el nivel a mano (`levelOverrides`).
- La progresión semanal tiene un tope que define Entrenador, para evitar sobrecarga.

## 6. Motor de mazo (core `deck-engine.js`)

`nextCard(state, deck, filters, rng, now)` es una función pura con estos pasos:

1. Filtrar por mazo activo, lugar, zonas a cuidar (excluye contraindicadas) y nivel del grupo (±1).
2. Bajar el peso de las cartas recientes (últimas 24–48 h) y de los grupos trabajados hoy.
3. Subir el peso de los grupos sin trabajar en la semana (balance de cuerpo completo).
4. Hacer una elección ponderada con un `rng` inyectable (con *seed* en los tests).

## 7. Estrategia offline y de sincronización

- **App shell + contenido + sprites + SFX** se precachean con el SW, que se activa tras la primera carga. Las actualizaciones aplican *stale-while-revalidate* y se avisa «Nueva versión, toca para actualizar».
- **Sin cuenta**: todo funciona solo con IndexedDB.
- **Con cuenta (Google)**, la sincronización sigue estos pasos:
  1. Push: subir eventos con `id > lastPushedEventId` en lote. Es idempotente porque el ID del documento es el ID del evento.
  2. Pull: traer eventos con `serverAt > lastPullAt` (de otros dispositivos) y unirlos por `id`.
  3. Recalcular `state` con el core y escribir `users/{uid}.derived` (caché).
  4. Disparadores: evento `online`, apertura de la app, después de cada ¡Listo! (con *debounce* de 30 s) y Background Sync si está disponible.
- Los conflictos no existen: el registro es solo-anexar y los ajustes siguen *last-write-wins* según `ts`.
- La persistencia offline del SDK de Firestore es opcional. Preferimos nuestra cola propia para no depender de ella (y para que funcione sin cuenta).
- **Exportación automática del progreso**: con cuenta, la nube es un respaldo continuo. Además, Menú → «Exportar» descarga un JSON (eventos + perfil) y un CSV simple. «Importar» permite unir un JSON. A partir de F3 se ofrecerá un recordatorio mensual de exportación.

## 8. Notificaciones

**MVP (F4): solo locales, sin servidor.**

- El usuario elige el patrón: mañana, tarde, noche o personalizado (horas). Más adelante el patrón se adapta a la actividad previa (`schedule.js`, función pura).
- Limitación real de la web: **no existe una API estándar para programar notificaciones locales a una hora exacta** con la app cerrada (la Notification Triggers API se abandonó). Por eso el MVP combina:
  1. Si la app está abierta o en segundo plano reciente, el SW muestra la notificación con `registration.showNotification()` cuando corresponde.
  2. **Periodic Background Sync** (Chrome Android, solo con la PWA instalada; el navegador decide la frecuencia real): al despertar, el SW revisa `schedule` y muestra el recordatorio si toca. Es un mecanismo de *best effort*.
  3. Al abrir la app, un recordatorio dentro de la app si el día va sin cartas.
- Se pide permiso solo cuando el usuario activa recordatorios en Menú, nunca al arrancar.

**Más adelante (F6+):** push programado desde servidor (Web Push con VAPID) en un contenedor ligero en el VPS de Inge. Las suscripciones se guardarían en `users/{uid}/push/{id}`. Requiere ADR y el OK de Brooks.

## 9. Edad y perfiles

- Solo cuentas de **13 años o más**, con confirmación en el onboarding. No se guarda la fecha de nacimiento, solo `birthYearConfirmed13`.
- Los mazos infantiles (fase posterior) se activan bajo una cuenta adulta, en modo «sesión con niñas y niños», sin perfiles de menores.

## 10. Decisiones (ADR resumidos)

| ADR | Decisión | Estado |
|-----|----------|--------|
| 001 | Vite + JS vanilla, sin framework | Aceptada |
| 002 | Core puro + puertos y adaptadores (lógica separada del diseño) | Aceptada |
| 003 | Local primero con registro de eventos solo-anexar en IndexedDB | Aceptada |
| 004 | SW manual + plugin de build propio (precache del app shell; Firebase fuera del precache; periodicsync para recordatorios) | Aceptada (F1) |
| 005 | Firebase Spark (Auth Google + Firestore), opcional y con carga perezosa | Aceptada; config en `src/adapters/firebase/config.js` |
| 006 | Hash router, `base: '/snapfit/'`, GitHub Pages | Aceptada |
| 007 | Temas con tokens CSS `[data-theme]`; Tailwind opcional | Aceptada |
| 008 | Notificaciones locales en el MVP; push de servidor después (VPS de Inge) | Aceptada |
| 009 | Código MIT, contenido y assets CC BY 4.0 con procedencia obligatoria | Aceptada |
| 010 | Firebase Analytics mínimo: solo `card_done`, `card_skip`, `level_up`, `theme_change` con parámetros en lista blanca; sin uid ni texto libre; desactivable (ver `docs/PRIVACY.md`) | Aceptada (Brooks, 2026-10-03) |
