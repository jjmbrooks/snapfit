# 03: Contenido (schema de cartas y mazos)

El contenido de entrenamiento lo **define Entrenador** (con apoyo de researcher) en `docs/training/`. Codelius lo transcribe a `content/**.json` sin inventar ejercicios ni dosis.

## 1. Grupos musculares (enum estable)

| ID | Incluye |
|----|---------|
| `piernas` | cuádriceps, isquiotibiales, pantorrillas |
| `gluteos` | glúteo mayor y medio, cadera |
| `empuje` | pecho, hombro anterior, tríceps |
| `traccion` | espalda alta, dorsal, bíceps (variantes sin equipo: toalla, isométricos, mesa firme) |
| `core` | abdomen, oblicuos, lumbares (antiextensión, antirrotación) |
| `movilidad` | movilidad articular y estiramiento activo |
| `cardio` | trabajo metabólico de bajo impacto o alto impacto según nivel |

## 2. Lugares (enum)

`casa`, `oficina`, `parque`, `aula`, `cualquiera`

## 2b. Equipo (enum; se prefiere `ninguno`)

`ninguno`, `silla`, `pared`, `toalla`, `mesa-firme`, `banca-parque`, `escalon`

## 3. Zonas a cuidar (enum, para filtros y contraindicaciones)

`rodilla`, `hombro`, `muneca`, `lumbar`, `cuello`, `tobillo`, `cadera`, `embarazo`, `hipertension`, `equilibrio`

## 4. Schema de carta (JSON) — **contrato**

```json
{
  "id": "sentadilla-silla-l1",
  "version": 1,
  "name": "Sentadilla a la silla",
  "shortName": "Sentadilla silla",
  "muscleGroups": ["piernas", "gluteos"],
  "primaryGroup": "piernas",
  "level": 1,
  "dose": {
    "type": "reps",
    "reps": 10,
    "durationSec": null,
    "sets": 1,
    "restSec": 0,
    "tempo": "2-0-2",
    "perSide": false,
    "estimatedSec": 40
  },
  "locations": ["casa", "oficina", "aula", "cualquiera"],
  "equipment": ["silla"],
  "impact": "bajo",
  "noise": "silencioso",
  "steps": [
    "Párate frente a una silla firme, pies al ancho de cadera.",
    "Lleva la cadera atrás hasta rozar el asiento.",
    "Empuja el piso y vuelve arriba."
  ],
  "cues": ["Rodillas en línea con la punta del pie", "Pecho orgulloso"],
  "easier": "sentadilla-silla-sentado-l1",
  "harder": "sentadilla-libre-l2",
  "careZones": ["rodilla"],
  "contraindications": [
    "Dolor agudo de rodilla durante el movimiento: detener y usar la variante más fácil."
  ],
  "decks": ["adulto-general"],
  "demographicNotes": {
    "mayores": "Usar apoyo de manos en la silla.",
    "ninos": null
  },
  "sprite": {
    "sheet": "assets/sprites/sentadilla-silla-l1.png",
    "frameWidth": 32,
    "frameHeight": 32,
    "frames": 8,
    "fps": 8,
    "loop": true
  },
  "sfx": null,
  "flavorText": "¡La silla es tu checkpoint!",
  "sources": [
    {
      "type": "peer-reviewed | guideline | public-domain-technique",
      "citation": "Autor A, Autor B. Título. Revista. Año;Vol(Num):pp.",
      "doi": "10.xxxx/xxxxx",
      "url": "https://…",
      "note": "Qué respalda esta fuente (dosis, seguridad, progresión)."
    }
  ],
  "reviewedBy": "entrenador",
  "reviewedAt": "2026-10-03",
  "license": "CC-BY-4.0"
}
```

### Campos del reverso estilo C «grimorio arcade» (opcionales, 2026-10-03)

```json
"steps": [
  { "text": "Párate frente a una silla firme, pies al ancho de cadera.", "pose": "/art/poses/sentadilla-silla-l1-1.png" },
  "Lleva la cadera atrás hasta rozar el asiento.",
  { "text": "Empuja el piso y vuelve arriba." }
],
"flavor": "Línea de ambientación neutra (≤ 60)",
"breath": "Exhala al subir"
```

- `steps`: **1 a 3** pasos (el reverso muestra 3 filas). Cada paso es **texto** (formato original, sigue siendo válido) **u objeto** `{ text, pose? }`. `text` ≤ 90 caracteres. `pose` es una imagen relativa a `public/` (`/art/…` o `art/…`; sin `..` ni URLs externas) con su fila en `docs/ASSETS-PROVENANCE.md`.
- **Las poses de un estilo o personaje concreto (p. ej. el aprendiz de Vitalia) NO van en la carta**, van en el paquete de historia (`manifest.assets.poses`, ver `docs/story/STORY-PACKS.md`), que tiene prioridad. En la carta solo van poses **neutras**, válidas para cualquier historia (ADR-011).
- `flavor` (≤ 60): ambientación **neutra**. Se sigue aceptando el campo antiguo `flavorText`. La ambientación propia de una historia va en `story.json → cardFlavor` del paquete, que tiene prioridad.
- `breath` (≤ 32): indicación de respiración para la tira inferior del reverso. Es contenido de **Entrenador**. Si falta, se usa la del paquete (`cardBack.breath`) o la de la interfaz («Respira sin aguantar el aire»).
- Validación: `src/ui/card/card-data.js → cardExtrasErrors` (la usan `npm run check:content` y `tests/ui/card-data.test.js`).
- **`video` queda en desuso:** Brooks descartó la idea de animación/video en el reverso (2026-10-03). El campo se ignora.

### Reglas del schema

- `id` sigue el formato kebab-case `<movimiento>-l<nivel>`. Es **estable**: no se renombra sin migración.
- `level` va de 1 a 10. `dose.type` puede ser `reps`, `time` o `hold`. `estimatedSec` debe ser de 120 o menos (microsesión).
- Si `primaryGroup` existe, debe estar dentro de `muscleGroups`.
- `sources` lleva **al menos una** fuente. Sin fuentes la carta no se publica.
- `careZones` alimenta el filtro «zonas a cuidar»: una carta que lista una zona marcada por el usuario **se excluye** o se ofrece su variante `easier` si esta no lista esa zona.
- `sprite.sheet` debe tener su fila en `docs/ASSETS-PROVENANCE.md`. Mientras no exista el sprite se usa `null` y la UI muestra un placeholder.
- `flavorText` es opcional (formato antiguo de `flavor`, ver arriba).
- La validación en CI la hace `scripts/check-content.mjs` (`npm run check:content`). Más adelante se puede formalizar como JSON Schema.
- **Borradores:** `"draft": true` + `"draftNote"` marcan cartas provisionales (sin `sources`, sin `reviewedBy`). La UI las muestra con la etiqueta «BORRADOR · pendiente de Entrenador». Una carta sin `draft` **debe** tener `sources`.
- **Sprite provisional:** mientras no haya sprite sheet se permite `"sprite": { "procedural": "<anim>", "prop": "chair|wall|table|towel|null" }`, que se dibuja por código (`src/ui/components/sprite.js`). Animaciones disponibles: `squat`, `pushup-wall`, `pushup-incline`, `bridge`, `march`, `calf`, `row`, `birddog`, `plank`, `arms`, `jacks`, `lunge`.

### Contenido actual (F1)

`content/cards/adulto-general.draft.json` tiene **12 cartas borrador** (niveles 1–2) escritas por Codelius **sin citas**, con ejercicios simples y seguros con el propio peso, para probar el motor. Se reemplazan por la entrega de Entrenador (Kanban `t_78a921ff`). `content/leveling.json` contiene los umbrales provisionales.

## 5. Mazos (decks)

```json
{
  "id": "adulto-general",
  "name": "Adulto general",
  "minAge": 13,
  "requiresAdultAccount": false,
  "levels": [1, 2, 3],
  "cards": ["sentadilla-silla-l1", "…"],
  "sources": ["docs/training/…"],
  "license": "CC-BY-4.0"
}
```

| Deck ID | Público | Entrega |
|---------|---------|---------|
| `adulto-general` | Adultos y adolescentes de 13 años o más | **MVP: niveles 1–3, unas 40 cartas** |
| `adulto-general` (ext.) | ídem | Niveles 4–10 |
| `mayores` | Personas mayores | Posterior |
| `ninos` | Niñas y niños, bajo una cuenta adulta (`requiresAdultAccount: true`) | Posterior |
| `ajustes-mujeres` / `ajustes-hombres` | Ajustes de dosis o variantes, si la evidencia los justifica | Posterior |

## 6. Configuración de nivelación

`content/leveling.json` traduce a parámetros los criterios de Entrenador (umbrales N, D, P y topes semanales); ver `02-ARCHITECTURE.md` §5.
