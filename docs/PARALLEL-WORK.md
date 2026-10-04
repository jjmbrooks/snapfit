# Trabajo en paralelo (varios modelos a la vez)

Objetivo: que varios modelos (Grok Bot, MiMo, agentes de Hermes, Runica…) mejoren **historia** y **UI** al mismo tiempo sin pisarse. Cada workstream es dueño de un conjunto de archivos; los cambios entran a `main` **solo por PR revisado por Codelius**.

## 1. Workstreams y archivos que posee cada uno

| Workstream | Kanban | Archivos que puede cambiar | No toca |
|------------|--------|----------------------------|---------|
| **story-copy** (historia, mundo, textos) | storyteller `t_22eec52e` | paquetes `content/stories/<id>/` + sus assets en `public/stories/<id>/` (guía: `docs/story/STORY-PACKS.md`), `content/copy/es.json`, `docs/story/*.md`, `docs/proposals/story/**`, `docs/proposals/copy/**` | `content/stories/index.json` (paquete por defecto: lo cambia Codelius cuando Brooks elige), los schemas, código JS/CSS |
| **ui-tokens** (temas, paleta, tipografía, base) | disenador `t_bf5e6169` | `src/ui/styles/tokens.css`, `src/ui/styles/base.css`, `docs/proposals/ui/**` | colores de familia sin pasar el test de contraste |
| **card-frame** (marco de carta, reverso, volteo; estilo C «grimorio arcade», ver `docs/ui/CARTA-ARCADE.md`) | disenador `t_bf5e6169` | `src/ui/card/frame.css`, `src/ui/card/back.css`, `src/ui/card/flip.css`, `src/ui/card/emblems.js`, `src/ui/styles/grimorio.css`; arte en `public/art/<carpeta>/` conectado por el manifest del paquete; el markup en `src/ui/components/tcard.js` solo de acuerdo con Codelius | lógica de `bindCard` |
| **screens** (pantallas y animaciones) | disenador `t_bf5e6169` + Codelius | `src/ui/screens/<pantalla>.css`, `src/ui/card/deck.css`; `src/ui/views/<pantalla>.js` (una pantalla por archivo: `onboarding`, `card`, `reward`, `progress`, `achievements`, `menu`, `privacy`) | `src/core/**`, adaptadores |
| **assets** (ilustraciones, video, sprites, insignias, audio) | director-creativo `t_7db959be`, melody `t_b20e2d87` | `public/assets/{cards,video,badges,sfx,music}/**`, `docs/ASSETS-PROVENANCE.md` (una fila por archivo), campo `video`/`art` de las cartas vía PR de contenido | código |
| **training** (cartas, dosis, prueba rápida) | entrenador `t_78a921ff` | `content/cards/**`, `content/decks/**`, `content/leveling.json`, `docs/training/**`, `content/copy/es.json → quickTest` | textos narrativos |
| **core** (lógica pura) | Codelius / Runica | `src/core/**`, `tests/core/**`, `src/adapters/**`, `src/main.js`, `src/ui/app.js`, `src/sw/**`, CI, `firestore.rules` | estilos y textos |

Reglas de convivencia:

- **Textos fuera del código.** Todo texto visible nuevo va a `content/copy/es.json` (interfaz) o al paquete de historia `content/stories/<id>/story.json` (narrativa) y se usa con `t('clave')` (`src/ui/i18n/es.js`). El test `tests/content/copy-story.test.js` falla si una clave usada no existe o si una historia está incompleta.
- **Estilos aislados.** Una pantalla = un CSS en `src/ui/screens/`. El marco de carta vive solo en `src/ui/card/`. Los valores (colores, espacios, radios, tipografía) vienen de `tokens.css`; no metas colores sueltos en una pantalla salvo los propios de la carta.
- **Orden de la cascada:** `src/ui/styles/index.css`. Si creas un CSS nuevo, agrégalo ahí.
- **Historia ≠ mecánica (ADR-011):** una historia nueva o distinta es un **paquete** aparte; nunca se edita la mecánica para encajar una historia. Varias historias pueden desarrollarse en paralelo (una rama y un paquete por modelo) y convivir instaladas; Brooks elige la de por defecto y luego cada persona podrá elegir la suya.
- **IDs estables:** grupos musculares, insignias, cartas y mazos no se renombran (ver `docs/07-HANDOFF.md` §Contratos).
- Si necesitas tocar archivos de otro workstream, dilo en el PR y en la tarjeta Kanban; Codelius coordina.

## 2. Ramas

`<workstream>/<modelo>-<tema>`, en minúsculas y con guiones. Ejemplos:

- `story/mimo-pixelandia-v1`, `story/grok-reino-de-cartas`, `copy/mimo-onboarding-corto`
- `ui/grok-tokens-arcade`, `card/mimo-marco-personaje`, `screens/grok-felicitacion`
- `assets/director-carta-modelo`, `audio/melody-loop-v1`, `training/entrenador-mazo-adulto`, `core/runica-<slice>`

Una rama = un tema. Ramas cortas (idealmente < 1 día). Haz `git pull --rebase origin main` antes de abrir el PR.

## 3. Flujo de PR

1. Crea la rama desde `main` actualizado.
2. Trabaja **solo** en tus archivos (§1).
3. Corre localmente `npm run verify` (tests + contenido + procedencia + build) y las capturas (§4).
4. Abre un PR contra `main` con la plantilla (`.github/pull_request_template.md`): qué cambia, workstream, tarjeta Kanban, capturas antes/después, procedencia, costo.
5. CI corre en el PR: tests, validaciones, build y **capturas 390×844** (artefacto `capturas-390x844`). **No despliega.**
6. **Codelius revisa e integra.** Nadie más hace push directo a `main` ni merge. Prohibido force-push.
7. Al integrarse, el push a `main` despliega a GitHub Pages.

**Propuestas que compiten** (dos modelos con dos ideas de historia o de UI): cada una en su rama y su archivo (un paquete `content/stories/<id>/`, `docs/proposals/<tema>/<modelo>.md`). Se integran **todas** como opciones (sin activarlas); Brooks elige y Codelius cambia la activa.

## 4. Correr, probar y capturar

```bash
npm install
npm run dev                      # http://localhost:5173/snapfit/   (?story=<id> para otra historia)
npm run verify                   # tests + check:content + check:provenance + build
npm run preview -- --port 4173 & # sirve dist/
npm run screens -- http://localhost:4173/snapfit/ docs/proposals/<tema>/<modelo>/   # 18 capturas 390×844
npm run docs:microcopy           # regenera docs/story/MICROCOPY.md si cambiaste textos
npm run screens:stories -- http://localhost:4173/snapfit/ <outDir> sentadilla-silla-l1 [ids…]   # misma carta en cada paquete
```

`npm run screens` recorre bienvenida → login (simulado: el popup de Google no se automatiza) → perfil → prueba → aviso → carta → volteo → Otro → ¡Listo! → felicitación → progreso → logros → siguiente carta → pestañas, y **falla** si hay errores de JS, overflow horizontal o si la barra inferior tapa botones.

**Evidencia visual obligatoria** en todo PR que cambie UI o textos visibles: capturas antes/después en el PR (pega las relevantes o enlaza el artefacto de CI). Los cambios visuales grandes (tema, marco de carta) además requieren **QA con un modelo multimodal** (que vea las capturas y reporte legibilidad, contraste, consistencia) antes de pedir review.

## 5. Procedencia de assets

Ningún archivo de imagen, video, sprite, fuente o sonido entra sin su fila en `docs/ASSETS-PROVENANCE.md` **en el mismo PR**: ruta, autor (persona/agente), modelo o herramienta, prompt o método, fecha, licencia. CI lo verifica (`npm run check:provenance` sobre `public/**`). Las capturas de evidencia en `docs/` no son assets de la app.

## 6. Costo

Solo **cuota de Grok Bot** o herramientas **gratuitas** (Xiaomi MiMo, herramientas libres). **Antes de usar cualquier cosa de pago** (API, modelo de imagen/video/música, assets, servicios) se pregunta a Brooks en la tarjeta Kanban y se espera su OK. Anota en el PR qué modelo/herramienta usaste.

## 7. Kanban (board `nexia`, MCP `hermes-kanban`)

- Épica: `t_b0474a6f`. Cada trabajo paralelo cuelga de la tarjeta de su workstream (§1) o de una tarjeta hija nueva.
- Título de tarjeta hija: `[snapfit][<workstream>] <tema> (<modelo>)`, por ejemplo `[snapfit][story] Propuesta Reino de Cartas (mimo)`.
- Comentarios: al empezar (rama), al abrir PR (enlace) y al terminar (resultado + fila de consumo en `docs/05-ROADMAP.md`).
- Bloqueos (falta un modelo gratis, duda de costo, conflicto de archivos): `bloquear_kanban` con el motivo y aviso a Codelius.

## 8. Cómo empieza un modelo nuevo (resumen)

1. Lee `AGENTS.md`, este archivo y la doc de su workstream (`docs/story/` para historia; `docs/01-PRODUCT.md` para UI).
2. Toma o crea su tarjeta en Kanban bajo `t_b0474a6f`; crea la rama `<workstream>/<modelo>-<tema>`.
3. `npm install && npm run dev`; cambia solo sus archivos.
4. `npm run verify` + `npm run screens`; QA multimodal si es visual.
5. Abre PR con la plantilla y espera la revisión de Codelius.

## 9. Recomendación pendiente (requiere OK de Brooks)

Activar **branch protection** en `main` (exigir PR, 1 aprobación y CI verde; bloquear force-push). Hoy no está activada; la regla «solo Codelius integra» se cumple por convención.
