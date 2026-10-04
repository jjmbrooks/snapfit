# AGENTS.md: instrucciones para agentes y bots

Implementas código en el repo **snapfit**.

## Jerarquía (ecosistema NexIA)

**Brooks** → **NexIA** → **Codelius** (owner técnico de este repo) → **Runica** (slices Kanban asignados a `runica`).

El detalle está en `docs/06-ROLES.md`. Inge se encarga de la infraestructura y los secretos. No se hacen forks paralelos del producto.

## Trabajo en paralelo (desde 2026-10-03)

Varios modelos trabajan a la vez en historia y UI. **Lee `docs/PARALLEL-WORK.md` antes de tocar nada**: workstreams, archivos de cada uno, ramas `<workstream>/<modelo>-<tema>`, PR obligatorio revisado por Codelius (nadie más hace push a `main`), `npm run verify`, `npm run screens` y evidencia visual.

- Textos visibles: `content/copy/es.json` (interfaz) y `content/story/<id>.json` (narrativa), usados con `t()`. No escribas textos en el código.
- Estilos: tokens en `src/ui/styles/tokens.css`; marco de carta en `src/ui/card/`; una pantalla = un CSS en `src/ui/screens/`.
- Historia y mundo: `docs/story/` (v0, abierta a propuestas en `docs/proposals/`).

## Antes de codear

1. Lee en orden: `docs/00-VISION.md` → `01` → `02` → `03` → `04` → `05` → `06` → `07`.
2. Si algo no está en `docs/`, **no lo inventes**: ni ejercicios, ni dosis, ni stack. El contenido de entrenamiento viene **solo** de `docs/training/` (Entrenador) y de `content/` validado.
3. Implementa **solo la fase abierta** de `docs/05-ROADMAP.md`.
4. Respeta las decisiones (ADR) de `docs/02-ARCHITECTURE.md` §10.

## Reglas duras

- **La lógica va separada del diseño.** `src/core/` es JS puro: sin DOM, sin Firebase, sin `window`, y se puede probar con Node. La UI vive en `src/ui/`. Los temas son tokens CSS.
- **Local primero.** La app funciona completa sin cuenta y sin red. Firebase es opcional y va detrás de un adaptador (`src/adapters/`).
- **Procedencia de assets.** Ninguna imagen ni sonido entra al repo sin su fila en `docs/ASSETS-PROVENANCE.md`.
- **Nada de dinero.** No contrates APIs, assets ni servicios de pago sin el OK de Brooks. Puedes usar la cuota de Grok Bot y Xiaomi MiMo.
- **Seguridad del usuario.** Cada carta lleva contraindicaciones o zonas a cuidar y fuentes. No se publica una carta sin `sources`.
- Edad mínima de perfil: **13+**. Los mazos infantiles se usan bajo una cuenta adulta.

## Prohibido sin ADR y OK de Brooks

- React, Vue, Svelte, Angular o game engines (Phaser, etc.)
- Un backend propio en el MVP (más allá de Firebase Spark)
- Push desde servidor antes de la fase correspondiente (VPS de Inge)
- Analítica de terceros o rastreo **más allá** de lo aprobado en ADR-010 (Firebase Analytics mínimo, ver `docs/PRIVACY.md`)
- Renombrar IDs de cartas, insignias o mazos sin migración
- Código de la app durante F0

## Commits

- Codelius integra en `main`; los demás modelos abren PRs cortos desde su rama (ver `docs/PARALLEL-WORK.md`). Prefijos: `F0:`, `F1:`, `docs:`, `content:`, `assets:`.
- Prohibido hacer force-push a `main`. No subas secretos. El `firebaseConfig` web es público por diseño; las reglas de Firestore son la protección real.
- Sin identidad git en la caja: usa `GIT_AUTHOR_NAME=jjmbrooks GIT_AUTHOR_EMAIL=jjmbrooks@users.noreply.github.com` (y las mismas variables `COMMITTER`).

## Reportar avances

```
Fase: Fx
Hecho: …
Pendiente: …
Bloqueos: …
Consumo: (fila nueva en docs/05-ROADMAP.md §Bitácora)
```

## Smoke (desde F1)

```bash
npm install
npm test                 # core puro + contraste de temas
npm run check:content    # reglas de cartas
npm run check:provenance # assets con procedencia
npm run build
npm run verify           # todo lo anterior en un comando
npm run preview -- --port 4173 &
npm run screens -- http://localhost:4173/snapfit/ /tmp/capturas   # 18 capturas 390×844
```

## Fuente de verdad

| Pregunta | Archivo |
|----------|---------|
| ¿Para quién y con qué tono? | `docs/00-VISION.md` |
| ¿UI, pantallas, juego, temas? | `docs/01-PRODUCT.md` |
| ¿Módulos, datos, Firestore, offline? | `docs/02-ARCHITECTURE.md` |
| ¿Schema de cartas y mazos? | `docs/03-CONTENT.md` |
| ¿Evidencia y dosis? | `docs/04-SCIENCE.md` → `docs/training/` |
| ¿Qué fase sigue? | `docs/05-ROADMAP.md` |
| ¿Quién hace qué? | `docs/06-ROLES.md` |
| ¿Cómo retomar? | `docs/07-HANDOFF.md` |
| ¿Cómo trabajar en paralelo (ramas, PR, archivos por workstream)? | `docs/PARALLEL-WORK.md` |
| ¿Mundo, historia, bienvenida, textos? | `docs/story/` → `content/story/*.json`, `content/copy/es.json` |
| ¿De dónde salió este asset? | `docs/ASSETS-PROVENANCE.md` |
| ¿Qué datos se recogen? | `docs/PRIVACY.md` |
