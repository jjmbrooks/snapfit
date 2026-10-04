# 05: Roadmap

Las fases son secuenciales y cada una tiene su DoD. Al cerrar una fase se marcan sus checkboxes y se agrega una fila a la **bitácora de consumo** (§Bitácora).

---

## F0: Docs y repositorio *(cerrada, 2026-10-03)*

**DoD:**

- [x] Repo público `jjmbrooks/snapfit` con `main`
- [x] `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `LICENSE` (MIT), `LICENSE-ASSETS.md` (CC BY 4.0), `.gitignore`
- [x] `docs/00` … `docs/07` + `docs/ASSETS-PROVENANCE.md`
- [x] Épica y tarjetas Kanban de especialistas creadas (ver `06-ROLES.md`)
- [x] Brooks crea el proyecto Firebase y pega el `firebaseConfig` (`snapfit-c7beb`, Firestore `nam5`)

## F1: Shell PWA *(cerrada, 2026-10-03)*

Incluye Vite (`base: '/snapfit/'`), hash router, las 3 vistas base (Carta, Progreso, Menú), tokens CSS con los 6 temas (paletas provisionales), manifest con íconos placeholder, SW con precache, un workflow de Pages y un check de procedencia en CI.

**DoD:**

- [x] `npm run build` y `npm test` OK; deploy en https://jjmbrooks.github.io/snapfit/
- [x] Manifest + SW con precache; abre offline tras la primera carga (verificado en Chrome headless). *Instalación en un Android real: pendiente de prueba de Brooks*
- [x] 390×844 sin overflow; targets de 48 px o más; selector de 6 temas funcional (contraste AA verificado por test)
- [x] `src/core/` sin imports de DOM ni Firebase (`tests/core/purity.test.js`)
- [x] Check de procedencia y de contenido en CI

## F2: Core del juego y mazo MVP (local) *(avanzada; falta contenido de Entrenador)*

Incluye `deck-engine`, `streaks`, `xp`, `leveling` (parámetros de `content/leveling.json`) y `achievements` con tests, IndexedDB con registro de eventos, las cartas MVP de Entrenador en `content/` con JSON Schema validado en CI, sprites placeholder o reales, ¡Listo! / Otra carta / esfuerzo opcional, progreso diario, racha e insignias básicas.

**DoD:**

- [x] Abrir la app muestra una carta de inmediato (sin login ni splash)
- [ ] Unas 40 cartas (niveles 1–3) con `sources` → **pendiente de Entrenador (t_78a921ff)**. Hoy hay 12 borradores sin citas; validación en CI (`check:content`) lista
- [x] Tests del core en las funciones públicas (47 tests); motor reproducible con *seed*
- [x] Filtros de lugar y zonas a cuidar (con sustitución por la variante más fácil)
- [x] Exportar JSON/CSV e importar JSON
- [x] Racha con comodín semanal, XP, niveles por grupo (heurística borrador), 22 insignias, vitrina y compartir PNG

## F3: Cuenta y sincronización (Firebase Spark) *(código listo; faltan las reglas desplegadas y la prueba real)*

Incluye Google Sign-In, sincronización de eventos (push y pull idempotente), reglas de Firestore finales con tests en el emulador, «Borrar mi cuenta» y recordatorio de exportación.

**DoD:**

- [x] Login opcional (popup con redirect como alternativa); la app funciona completa sin cuenta
- [ ] Dos dispositivos convergen al mismo estado (código de push/pull idempotente listo; **falta prueba real**)
- [ ] Reglas: `firestore.rules` escritas; **desplegarlas (Brooks: `firebase deploy --only firestore:rules`)** y probarlas con el emulador
- [ ] Brooks: verificar que `jjmbrooks.github.io` está en Auth → Settings → Authorized domains
- [x] Sin claves secretas en el repo (el `firebaseConfig` web es público)

## F4: Juego completo y recordatorios locales

Incluye las animaciones de sprites de las cartas MVP (director-creativo), los SFX (melody), la vitrina de logros, compartir la imagen del logro, el microcopy final (storyteller), las paletas finales (disenador) y recordatorios locales con patrón (mañana, tarde, noche o personalizado).

**DoD:**

- [ ] Las cartas MVP tienen sprite, cada uno con su fila de procedencia
- [ ] Compartir logro funciona en Android (Web Share) con descarga como alternativa
- [x] Recordatorios: aviso dentro de la app + notificación con la app abierta o en segundo plano + Periodic Background Sync cuando haya soporte; permiso pedido solo desde Menú (adelantado en F1)
- [ ] Contraste AA verificado en los 6 temas

## F5: v1, niveles 4–10 y nivel por grupo afinado

Incluye la entrega 2 de Entrenador (niveles 4–10), los criterios de nivelación afinados y un patrón de recordatorio adaptativo según la actividad previa.

**DoD:** niveles 1–10 jugables; prueba de uso de Brooks durante 7 días sin bloqueos.

## F6+: Mazos demográficos y push de servidor

Incluye los mazos `mayores` y `ninos` (bajo una cuenta adulta) y los ajustes para mujeres y hombres, push programado (Web Push y VAPID) desde un contenedor en el VPS de Inge (requiere ADR y el OK de Brooks) y la integración como módulo *Cuerpo* de «Mi día».

---

## Bitácora de consumo por fase

Brooks quiere medir el consumo de tokens y cuota por fase de desarrollo. **Cada agente agrega una fila al cerrar su trabajo.** Las cifras reales de cuota las llena **Brooks** si las tiene disponibles. **No se inventan números**: si no hay dato, se deja «—».

| Fase | Fecha | Agente | Esfuerzo aprox. / notas | Cuota Grok Bot (Brooks) | Cuota MiMo / Hermes (Brooks) |
|------|-------|--------|-------------------------|-------------------------|------------------------------|
| F0 | 2026-10-03 | Codelius (Grok Bot) | Repo, docs F0, épica y 5 tarjetas Kanban. Una sesión | — | — |
| F1 (+F2 parcial, F3 código, recordatorios F4) | 2026-10-03 | Codelius (Grok Bot) | Una sesión larga: unos 45 archivos nuevos (core + 47 tests, UI, SW, adaptadores Firebase, CI, docs PRIVACY/roadmap/handoff), varias iteraciones de layout con capturas headless. Sin Runica | — | — |
| F2b (feedback Android de Brooks) | 2026-10-03 | Codelius (Grok Bot) | Una sesión: fix de barra inferior, onboarding con Google + perfil→mazo/nivel (core + tests), mecánica de mazo Listo/Otro, carta con volteo 3D, secuencia felicitación→progreso→logros, nuevo `scripts/screens.mjs`. Comentarios Kanban a 5 tarjetas. Sin generación de imagen/video (no hay herramienta disponible) | — | — |
| Paralelización (historia + UI) | 2026-10-03 | Codelius (Grok Bot) | Una sesión: textos a `content/copy/es.json` y `content/story/pixelandia.json` con `t()` y test de contrato; CSS dividido (tokens únicos, `src/ui/card/`, `src/ui/screens/`); `docs/story/` (WORLD, WELCOME-COPY, MICROCOPY generado); `docs/PARALLEL-WORK.md`, plantilla de PR, CI en `pull_request` con capturas | — | — |
| Paquetes de historia (ADR-011) | 2026-10-03 | Codelius (Grok Bot) | Una sesión: `content/stories/<id>/` (manifest + story + schemas), resolver `src/ui/story/` con fallback y validación, ajuste `storyId` local + Firestore, selector oculto en Menú, SW cachea el paquete activo, paquetes `pixelandia` y `valle-gremios` (arte derivado de la carta modelo B), test de independencia, `scripts/story-shots.mjs` | — | — |

Guía para la columna de esfuerzo: número de sesiones o turnos, archivos tocados y si hubo reintentos. Desde el 2026-10-04, los slices de Runica van en filas propias con el ID de su tarjeta.
