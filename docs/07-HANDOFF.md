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

| Carpeta | Dueño | Nota |
|---------|-------|------|
| `docs/` (excepto `training/`) | Codelius | Se cambia con OK de NexIA o Brooks si toca contratos |
| `docs/training/` | Entrenador (Codelius lo commitea) | No se edita la dosis sin Entrenador |
| `content/` | Codelius (transcribe a Entrenador) | Se valida con el schema |
| `src/core/` | Codelius | JS puro; un PR por módulo |
| `src/adapters/`, `src/ui/` | Codelius; Runica en slices | No se mezcla lógica en la UI |
| `public/assets/` | director-creativo / melody → Codelius | Siempre con su fila de procedencia |
| `.github/workflows/` | Codelius / Inge | |

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
  - `src/ui/`: `app.js` (controlador), `router.js`, `views/*`, `components/{sprite,sfx,share}`, `styles/{tokens,themes,base}.css`, `i18n/es.js`
  - `src/sw/sw.js`: plantilla del SW; `vite.config.js` le inyecta el precache al compilar
  - `content/`: cartas borrador, mazo y `leveling.json`
- **Evidencia:** `docs/evidence/*.png` (390×844, generadas con `scripts/screens.mjs`).

## Pendientes de Brooks

- **Desplegar las reglas de Firestore:** `npm i -g firebase-tools && firebase login && firebase deploy --only firestore:rules` (desde la raíz del repo; `.firebaserc` apunta a `snapfit-c7beb`). Mientras no se desplieguen, la sincronización puede fallar con `permission-denied` (o quedar abierta si la base se creó en modo de prueba). La app lo muestra como «Sin sincronizar» en Menú.
- **Auth → Settings → Authorized domains:** confirmar que está `jjmbrooks.github.io`. Sin ese dominio, «Entrar con Google» falla con `auth/unauthorized-domain`.
- Probar la instalación en Android Chrome real y un recordatorio.
- (Opcional) Llenar las cifras de cuota en la bitácora de consumo.

## Siguiente trabajo (Codelius / Runica desde el 2026-10-04)

1. Integrar la entrega de Entrenador (t_78a921ff) → `content/cards/*.json` + `docs/training/` + `content/leveling.json`.
2. Integrar las paletas de disenador (t_bf5e6169) en `themes.css` (el test de contraste debe seguir verde) y el microcopy de storyteller (t_22eec52e) en `i18n/es.js`.
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
