# 07: Handoff (cómo retomar o trabajar en paralelo)

## Arranque en frío

1. `git clone https://github.com/jjmbrooks/snapfit.git`
2. Lee `AGENTS.md` → `docs/00` … `docs/06` → este archivo.
3. `git log -5 --oneline` y `05-ROADMAP.md` para ver la fase abierta.
4. No le vuelvas a pedir el brief a Brooks: está en `docs/`.
5. Revisa el estado de las tarjetas Kanban (tabla abajo) antes de integrar entregables.

## Contratos estables (no se rompen sin migración)

| Contrato | Dónde | Regla |
|----------|-------|-------|
| IDs de cartas, mazos e insignias | `03-CONTENT.md`, `01-PRODUCT.md` §4 | No se renombran sin migrar eventos |
| Enums: grupos, lugares, zonas, equipo | `03-CONTENT.md` | Solo se agregan valores, no se renombran |
| Tipos de evento + `v` | `02-ARCHITECTURE.md` §3 | Si cambia el shape, se sube `v` y se escribe un migrador |
| IndexedDB `snapfit`, prefijo LS `snapfit.` | `02` §3 | Obligatorio |
| Schema de Firestore + reglas | `02` §4 | Se cambian solo con test del emulador |
| IDs de tema | `01-PRODUCT.md` §5 | `medianoche, manana, chicle, selva, pacifico, volcan` |
| `base` de Vite | `vite.config.js` | `/snapfit/` |

## Ownership de carpetas

El reparto detallado por workstream (historia, tokens, marco de carta, pantallas, assets, entrenamiento, core) está en **`docs/PARALLEL-WORK.md` §1**. Resumen:

| Carpeta | Dueño | Nota |
|---------|-------|------|
| `docs/` (excepto `training/`, `story/`, `proposals/`) | Codelius | Se cambia con OK de NexIA o Brooks si toca contratos |
| `docs/story/`, `content/stories/<id>/`, `public/stories/<id>/`, `content/copy/` | storyteller y modelos de historia (por PR) | `content/stories/index.json` (por defecto) lo cambia Codelius cuando Brooks elige |
| `docs/proposals/` | cualquier modelo (por PR) | Propuestas en competencia |
| `docs/training/` | Entrenador (Codelius lo commitea) | No se edita la dosis sin Entrenador |
| `content/cards`, `content/decks`, `content/leveling.json` | Codelius (transcribe a Entrenador) | Se valida con el schema |
| `src/core/` | Codelius | JS puro; un PR por módulo |
| `src/ui/styles/`, `src/ui/card/`, `src/ui/screens/` | disenador y modelos de UI (por PR) | Tokens únicos en `tokens.css` |
| `src/adapters/`, `src/ui/*.js`, `src/ui/views/` | Codelius; Runica en slices | No se mezcla lógica en la UI |
| `public/assets/` | director-creativo / melody (por PR) | Siempre con su fila de procedencia |
| `.github/` | Codelius / Inge | |

## Checklist de sesión

- [ ] ¿Leí la fase abierta?
- [ ] ¿Toco un contrato? → migración y docs
- [ ] ¿Agrego un asset? → fila en `ASSETS-PROVENANCE.md`
- [ ] ¿Agrego una dependencia? → ADR en `02` §10
- [ ] Al terminar: commits con prefijo de fase, fila en la bitácora de consumo y reporte

## Estado al 2026-10-03 (fin de sesión de Codelius)

- **En vivo:** https://jjmbrooks.github.io/snapfit/ (deploy con `.github/workflows/deploy.yml` en cada push a `main`).
- **Hecho:** F1 completa; F2 menos el contenido real; código de F3 (Auth + sync); recordatorios locales (parte de F4). Ver los checkboxes en `05-ROADMAP.md`.
- **Mapa del código:**
  - `src/core/`: puro (deck-engine, leveling, streaks, xp, achievements, schedule, derive, export, events, time)
  - `src/adapters/`: `storage-idb`, `clock`, `notify-local`, `firebase/{config,app,auth,sync,analytics}`
  - `src/ui/`: `app.js` (controlador), `router.js`, `views/*` (una pantalla por archivo), `components/{tcard,sprite,sfx,share}`, `styles/{index,tokens,base}.css`, `card/*.css`, `screens/*.css`, `i18n/es.js` (cargador de textos)
  - `src/sw/sw.js`: plantilla del SW; `vite.config.js` le inyecta el precache al compilar
  - `content/`: cartas borrador, mazo y `leveling.json`
- **Nuevo (F2b, feedback de Brooks):** `src/core/profile.js` (perfil → mazo y niveles base), `src/core/deck-queue.js` (Otro = al fondo), `src/ui/components/tcard.js` (carta estilo personaje con volteo y ranura de video), `src/ui/views/reward.js` (felicitación → progreso → logros), `src/ui/views/onboarding.js` (bienvenida → Google → perfil → aviso), `src/ui/card/*.css` + `.fam-*`/`.tier-*` en `tokens.css` (colores por familia y tiers por nivel). El look sigue siendo **interino** hasta el spec de disenador y los assets de director-creativo.
- **Paralelización (2026-10-03):** el repo está listo para que varios modelos trabajen a la vez en historia y UI. Reglas, workstreams, ramas y PR en `docs/PARALLEL-WORK.md`. Textos en `content/copy/es.json` (`t()` en `src/ui/i18n/es.js`) + **paquetes de historia** `content/stories/<id>/` resueltos por `src/ui/story/` (ADR-011, `docs/story/STORY-PACKS.md`; instalados: `pixelandia` por defecto y `valle-gremios` en borrador; selector oculto en Menú con `?historias=1`); tokens en `src/ui/styles/tokens.css`; marco de carta en `src/ui/card/`; CSS por pantalla en `src/ui/screens/`. CI corre en cada PR (tests, build, capturas; sin deploy). Textos que aún viven en código (menú, progreso, logros, toasts): lista en `docs/story/MICROCOPY.md` §3, pendiente de migrar.
- **Evidencia:** `docs/evidence/*.png` (390×844, generadas con `scripts/screens.mjs`).

## Pendientes de Brooks

- **(Recomendado) Branch protection en `main`:** exigir PR + CI verde + 1 aprobación y bloquear force-push. No se activó sin su OK.
- **Elegir la historia por defecto** (`content/stories/index.json`) y cuándo mostrar el selector «Historia» a todos.
- **Desplegar las reglas de Firestore (ahora incluyen `profile` y `settings.storyId`):** `npm i -g firebase-tools && firebase login && firebase deploy --only firestore:rules` (desde la raíz del repo; `.firebaserc` apunta a `snapfit-c7beb`). Mientras no se desplieguen, la sincronización puede fallar con `permission-denied` (o quedar abierta si la base se creó en modo de prueba). La app lo muestra como «Sin sincronizar» en Menú.
- **Auth → Settings → Authorized domains:** confirmar que está `jjmbrooks.github.io`. Sin ese dominio, «Entrar con Google» falla con `auth/unauthorized-domain`.
- Probar la instalación en Android Chrome real y un recordatorio.
- (Opcional) Llenar las cifras de cuota en la bitácora de consumo.

## Siguiente trabajo (Codelius / Runica desde el 2026-10-04)

1. Integrar la entrega de Entrenador (t_78a921ff) → `content/cards/*.json` + `docs/training/` + `content/leveling.json`.
2. Integrar las paletas de disenador (t_bf5e6169) en `src/ui/styles/tokens.css` (el test de contraste debe seguir verde) y la historia de storyteller (t_22eec52e) como paquete en `content/stories/` (más `content/copy/es.json` para textos neutros) (por PR, ver `docs/PARALLEL-WORK.md`).
3. Sustituir `sprite.procedural` por los sprite sheets de director-creativo (t_7db959be) con su procedencia; los SFX de melody (t_b20e2d87) reemplazan a `sfx.js`.
4. Test de reglas con el emulador de Firestore (`@firebase/rules-unit-testing`). Es buen candidato a slice para Runica.
5. Pruebas de UI con Playwright (smoke de carta → ¡Listo! → progreso). Ya existe la base en `scripts/screens.mjs` y también es candidato para Runica.

## Kanban (board `nexia`)

Creadas el 2026-10-03 (Codelius). Los hijos tienen como padre a la épica.

| ID | Assignee | Entrega |
|----|----------|---------|
| `t_b0474a6f` | `nexia` | Épica `[Grok:Codelius] SnapFit` |
| `t_78a921ff` | `entrenador` | Estrategia + niveles 1–3 + seguridad + ~40 cartas MVP con citas → `docs/training/`, `content/` |
| `t_bf5e6169` | `disenador` | Spec UI pixel-art, flujos, 6 temas con paletas AA, visuales de insignias |
| `t_22eec52e` | `storyteller` | Tono, microcopy ES, nombres de insignias, estilo del flavor text |
| `t_7db959be` | `director-creativo` | Sprites por carta (tras la lista de entrenador), íconos PWA, insignias, con procedencia |
| `t_b20e2d87` | `melody` | SFX `listo`, `otra-carta`, `logro`, `subir-nivel` + loop opcional, con procedencia |

`runica` no tiene tarjetas el 2026-10-03.

## Contacto

- GitHub: https://github.com/jjmbrooks/snapfit
- Owner: **jjmbrooks** (Jhonatan Jesús Martínez Brooks)
