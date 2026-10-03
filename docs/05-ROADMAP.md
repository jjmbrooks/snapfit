# 05: Roadmap

Las fases son secuenciales y cada una tiene su DoD. Al cerrar una fase se marcan sus checkboxes y se agrega una fila a la **bitácora de consumo** (§Bitácora).

---

## F0: Docs y repositorio *(en curso, 2026-10-03)*

**DoD:**

- [x] Repo público `jjmbrooks/snapfit` con `main`
- [x] `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `LICENSE` (MIT), `LICENSE-ASSETS.md` (CC BY 4.0), `.gitignore`
- [x] `docs/00` … `docs/07` + `docs/ASSETS-PROVENANCE.md`
- [x] Épica y tarjetas Kanban de especialistas creadas (ver `06-ROLES.md`)
- [ ] Brooks crea el proyecto Firebase y pega el `firebaseConfig`

## F1: Shell PWA

Incluye Vite (`base: '/snapfit/'`), hash router, las 3 vistas base (Carta, Progreso, Menú), tokens CSS con los 6 temas (paletas provisionales), manifest con íconos placeholder, SW con precache, un workflow de Pages y un check de procedencia en CI.

**DoD:**

- [ ] `npm run build` y `npm run test` OK; deploy en https://jjmbrooks.github.io/snapfit/
- [ ] Instalable en Android Chrome y abre offline tras la primera carga
- [ ] 360×640 sin overflow; targets de 48 px o más; selector de tema funcional
- [ ] `src/core/` sin imports de DOM ni Firebase (check con lint o test)

## F2: Core del juego y mazo MVP (local)

Incluye `deck-engine`, `streaks`, `xp`, `leveling` (parámetros de `content/leveling.json`) y `achievements` con tests, IndexedDB con registro de eventos, las cartas MVP de Entrenador en `content/` con JSON Schema validado en CI, sprites placeholder o reales, ¡Listo! / Otra carta / esfuerzo opcional, progreso diario, racha e insignias básicas.

**DoD:**

- [ ] Abrir la app muestra una carta en menos de 1 s (con caché caliente)
- [ ] Unas 40 cartas (niveles 1–3) con `sources`; validación del schema en CI
- [ ] Cobertura de tests del core en las funciones públicas; nivelación reproducible con *seed*
- [ ] Filtros de lugar y zonas a cuidar funcionando
- [ ] Exportar e importar JSON

## F3: Cuenta y sincronización (Firebase Spark)

Incluye Google Sign-In, sincronización de eventos (push y pull idempotente), reglas de Firestore finales con tests en el emulador, «Borrar mi cuenta» y recordatorio de exportación.

**DoD:**

- [ ] Login opcional; la app sigue funcionando completa sin cuenta
- [ ] Dos dispositivos convergen al mismo estado
- [ ] Reglas: un usuario no puede leer ni escribir datos de otro uid (test del emulador)
- [ ] Sin claves secretas en el repo

## F4: Juego completo y recordatorios locales

Incluye las animaciones de sprites de las cartas MVP (director-creativo), los SFX (melody), la vitrina de logros, compartir la imagen del logro, el microcopy final (storyteller), las paletas finales (disenador) y recordatorios locales con patrón (mañana, tarde, noche o personalizado).

**DoD:**

- [ ] Las cartas MVP tienen sprite, cada uno con su fila de procedencia
- [ ] Compartir logro funciona en Android (Web Share) con descarga como alternativa
- [ ] Recordatorios: permiso pedido solo al activarlos; Periodic Background Sync cuando haya soporte
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

Guía para la columna de esfuerzo: número de sesiones o turnos, archivos tocados y si hubo reintentos. Desde el 2026-10-04, los slices de Runica van en filas propias con el ID de su tarjeta.
