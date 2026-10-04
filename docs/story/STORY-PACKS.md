# Paquetes de historia (story packs)

> Requisito de Brooks (2026-10-03): **la historia es totalmente independiente de la mecánica y del progreso**, para que en el futuro cada persona pueda elegir o cambiar de historia sin perder nada. Decisión registrada como **ADR-011** en `docs/02-ARCHITECTURE.md`.

## 1. Idea

- La **mecánica** (cartas, mazo, Listo/Otro, volteo, niveles 1–10, XP, racha, insignias) vive en `src/core` y en `content/cards|decks|leveling.json`. Solo maneja **ids estables**.
- Una **historia** es un **paquete** que da nombre, texto y arte a esos ids: cómo se llama la familia `piernas`, qué dice la bienvenida, cómo se llama la insignia `streak-7`, qué región corresponde al nivel global 5, qué ilustración lleva la carta `sentadilla-silla-l1`.
- Cambiar de historia cambia **solo lo que se ve**. El progreso derivado es idéntico (lo prueba `tests/content/story-packs.test.js`).

| Cambia al cambiar de historia | No cambia nunca |
|-------------------------------|-----------------|
| Bienvenida, textos de login y «mazo listo» | Cartas, dosis, pasos, contraindicaciones (Entrenador) |
| Nombre e ícono de cada familia (grupo muscular) | Ids de grupos, cartas, mazos e insignias |
| Nombres de rango (tier) y de región por nivel global | Niveles 1–10, XP, racha, comodín, meta diaria |
| Títulos de felicitación, recordatorios, nombres de insignias | Insignias desbloqueadas, eventos guardados, nivel por grupo |
| Guía (personaje), arte de carta, piel del marco, fondos | Lógica de selección del mazo, nivelación |
| Música/SFX del paquete, tema por defecto y algunos tokens CSS | Textos de interfaz neutros (`content/copy/es.json`: botones, errores, aviso de salud) |

## 2. Estructura

```
content/stories/
  index.json                  # { "default": "vitalia" }  ← paquete por defecto (lo elige Brooks)
  story.schema.json           # JSON Schema de story.json
  manifest.schema.json        # JSON Schema de manifest.json
  <storyId>/
    manifest.json             # metadatos + referencias a assets
    story.json                # textos narrativos
public/stories/<storyId>/     # assets del paquete (rutas del manifest son relativas a esta carpeta)
  preview.jpg
  art/<cardId>.jpg|png|webp   # opcional
  frames/…, bg/…, guide/…, audio/…   # opcionales
```

Paquetes instalados hoy:

| id | Nombre | Estado | Tema por defecto | Assets |
|----|--------|--------|------------------|--------|
| `vitalia` | Vitalia · La Orden del Aliento | **published, por defecto** (de `docs/story/WORLD.md` v2; elegido por Brooks el 2026-10-03) | medianoche | preview y arte de `sentadilla-silla-l1` **provisionales** (copiados de valle-gremios), token `--story-accent` |
| `pixelandia` | El Reino de Pixelandia | draft (placeholder v0) | medianoche | preview |
| `valle-gremios` | El Valle de los Gremios | draft (de WORLD.md v1, hoy `docs/proposals/story/codelius-valle-gremios-v1.md`) | selva | preview, arte de `sentadilla-silla-l1`, token `--story-accent` |

## 3. `manifest.json`

| Campo | Obligatorio | Reglas |
|-------|-------------|--------|
| `id` | sí | `^[a-z0-9][a-z0-9-]{1,39}$`, igual a la carpeta y a `story.json → id` |
| `name`, `version` (semver), `author`, `license` | sí | licencia por defecto CC BY 4.0 |
| `status` | sí | `draft` · `review` · `published` · `retired` |
| `description` | no | ≤ 240 caracteres (se ve en el selector) |
| `preview` | no | imagen 16:9 aprox. para el selector |
| `defaultTheme` | sí | uno de los 6 temas; se aplica al **elegir** el paquete (la persona puede cambiarlo después) |
| `assets.cardArt.<cardId>` | no | ilustración de esa carta; si falta → animación genérica |
| `assets.frames.default` / `.<grupo>.<1-4\|all>` | no | piel del marco (frente) por familia y tier |
| `assets.backgrounds.welcome\|play` | no | fondos (`--story-bg-welcome`, `--story-bg-play`) |
| `assets.guide.sprite` | no | sprite del guía |
| `assets.audio.music`, `assets.audio.sfx.{listo,otro,flip,logro,nivel}` | no | reemplazan a los sonidos genéricos |
| `assets.tokens` | no | variables CSS permitidas: `--story-*`, `--primary`, `--on-primary`, `--accent`, `--on-accent` (hex). Si toca colores del tema, el test exige contraste AA sobre `defaultTheme` |

## 4. `story.json`

Todas las claves de familias, insignias y regiones son **ids estables del core**. Límites de longitud = lo que cabe a 390 px.

| Campo | Reglas |
|-------|--------|
| `id` | igual al manifest |
| `title` (≤ 40), `logline` | — |
| `welcome.title`, `welcome.lines` (1–5, ≤ 140 c/u), `welcome.cta` (≤ 28), `welcome.note` | bienvenida |
| `signin.title`, `.body`, `.offline` | `offline` admite `<b>` |
| `deckReady.title` | resumen tras el perfil |
| `guide.name`, `guide.role` | personaje guía |
| `families.<grupo>.name` (≤ 28), `.icon`, `.master` (opcional) | los 7 grupos: `piernas`, `gluteos`, `empuje`, `traccion`, `core`, `movilidad`, `cardio` |
| `tiers.1..4` (≤ 16) | rango por nivel de carta (1–3, 4–6, 7–9, 10) |
| `regions.1..10` (≤ 32) | región por nivel global |
| `rewards[]` (≤ 28) | títulos de felicitación |
| `reminders[]` (≤ 90) | textos de recordatorio |
| `badges.<badgeId>.name` (≤ 32), `.desc` (≤ 80) | **todas** las de `src/core/achievements.js → BADGE_IDS`, ni una más |

La carta siempre muestra también el **grupo muscular** (texto neutro), para que se entienda sin conocer la historia: frente «🌱 GREMIO DE TIERRA … Piernas · Glúteos».

## 5. Cómo se resuelve en la app

`src/ui/story/` (capa UI; el core no lo conoce):

1. **Id pedido:** `?story=<id>` (vista previa, no se guarda) → `profile.storyId` (ajuste del usuario) → `content/stories/index.json → default`.
2. **Validación** con los JSON Schema (`src/ui/story/schema.js`, sin dependencias) + insignias completas. Un paquete inválido se descarta y se registra en consola.
3. **Fallback por campo:** paquete activo → paquete por defecto → historia genérica (`src/ui/story/generic.js`). Si a un paquete le falta algo, se ve lo del siguiente nivel.
4. **Aplicación:** rellena los objetos de `src/ui/i18n/es.js` (`STORY`, `FAMILY_NAMES`, `BADGES`, `REGION_NAMES`…), aplica tokens y fondos en `<html>` (`data-story`, variables CSS).
5. **Carga perezosa:** los manifiestos van en el bundle; el `story.json` de cada paquete es un chunk aparte (pocos KB, el SW los precachea para poder cambiar sin red). Los **assets** (`public/stories/**`) no se precachean: el navegador los pide al mostrarlos y el SW guarda los del **paquete activo** (mensaje `CACHE_STORY`, caché `snapstory-<id>`; borra la del paquete anterior).

**Ajuste del usuario:** `profile.storyId` (IndexedDB) y `users/{uid}.settings.storyId` en Firestore (junto con `theme`; reglas `validSettings`). Solo el id, nunca textos.

**Selector:** Menú → «Historia», oculto tras una bandera mientras Brooks decide. Se activa en un dispositivo con `?historias=1` (se guarda en `localStorage`) y se apaga con `?historias=0`. Lista los paquetes instalados con su vista previa, estado y versión.

## 6. Crear un paquete nuevo

1. Copia `content/stories/valle-gremios/` a `content/stories/<tu-id>/`; cambia `id` en `manifest.json` y `story.json`.
2. Escribe los textos. Mantén las claves (ids) tal cual.
3. Assets opcionales en `public/stories/<tu-id>/…` y referéncialos en `manifest.assets` con rutas relativas.
4. **Procedencia:** una fila por archivo en `docs/ASSETS-PROVENANCE.md` con la ruta `public/stories/<tu-id>/…` (autor, modelo/herramienta, prompt, fecha, licencia). El test del paquete falla si falta.
5. **Costo:** solo cuota de Grok Bot o herramientas gratuitas; cualquier cosa de pago se pregunta a Brooks antes.
6. `npm run verify` (valida schema, insignias, longitudes, assets, procedencia, contraste).
7. Previsualiza: `npm run dev` → `/snapfit/?story=<tu-id>`; capturas: `npm run build && npm run preview -- --port 4173 &` y `npm run screens:stories -- http://localhost:4173/snapfit/ docs/proposals/story/<tu-id>/ sentadilla-silla-l1 <tu-id>`.
8. QA multimodal de las capturas (legibilidad, consistencia, tono).
9. PR `story/<modelo>-<tu-id>`. **No** cambies `content/stories/index.json`: el paquete por defecto lo decide Brooks.

## 7. Reglas que no se rompen

- Nada en `src/core`, `src/adapters` ni en los eventos guardados referencia textos de historia (test).
- No se renombran ids de grupo, carta o insignia para «encajar» una historia; se cambia el **nombre visible** en el paquete.
- El aviso de salud y los textos de seguridad son de `content/copy/es.json`, no del paquete.

## Carta arcade: campos de paquete (2026-10-03)

- `story.json → cardBack { title ≤ 28, breath ≤ 32 }`: título del reverso y respiración por defecto.
- `story.json → cardFlavor { <cardId>: texto ≤ 60 }`: ambientación por carta. Tiene prioridad sobre `flavor` de la carta.
- `manifest.assets.poses { <cardId>: [≤ 3 imágenes] }` y `manifest.assets.emblems { <grupo>: imagen }`.
- **Rutas:** relativas a `public/stories/<id>/` o absolutas `/art/<carpeta>/…` (relativas a `public/`). Las absolutas sirven para arte compartido que se deja en `public/art/` (p. ej. `public/art/vitalia/`).
- **Campos de identidad que NO se heredan del paquete por defecto:** `cardFlavor`, `cardBack`, `cardArt`, `poses`, `emblems` y `frames`. El paquete activo los define o se usa el respaldo genérico. Así un paquete nunca muestra el arte de otro.
- Diseño completo de la carta: `docs/ui/CARTA-ARCADE.md`.
