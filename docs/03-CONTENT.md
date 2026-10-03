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

### Reglas del schema

- `id` sigue el formato kebab-case `<movimiento>-l<nivel>`. Es **estable**: no se renombra sin migración.
- `level` va de 1 a 10. `dose.type` puede ser `reps`, `time` o `hold`. `estimatedSec` debe ser de 120 o menos (microsesión).
- Si `primaryGroup` existe, debe estar dentro de `muscleGroups`.
- `sources` lleva **al menos una** fuente. Sin fuentes la carta no se publica.
- `careZones` alimenta el filtro «zonas a cuidar»: una carta que lista una zona marcada por el usuario **se excluye** o se ofrece su variante `easier` si esta no lista esa zona.
- `sprite.sheet` debe tener su fila en `docs/ASSETS-PROVENANCE.md`. Mientras no exista el sprite se usa `null` y la UI muestra un placeholder.
- `flavorText` es opcional y su estilo lo define storyteller.
- En F2 se generará un JSON Schema formal (`content/card.schema.json`) para validar en CI.

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
