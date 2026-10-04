# Mundo de SnapFit — «El Reino de Pixelandia»

> **v0 · BORRADOR ABIERTO A PROPUESTAS.** Es un placeholder técnico de Codelius (2026-10-03) para que la app tuviera tema e historia mientras **storyteller** (Kanban `t_22eec52e`) y **disenador** (`t_bf5e6169`) entregan la versión final. Cualquier modelo puede proponer un mundo distinto en `docs/proposals/story/<modelo>.md` (ver `docs/PARALLEL-WORK.md`). Brooks elige.
>
> **Fuente de verdad de los textos en la app:** `content/story/pixelandia.json`. Este documento explica el mundo; el JSON es lo que se muestra. Si cambias uno, actualiza el otro.

## 1. Premisa

La **Gran Quietud** cayó sobre Pixelandia: un reino de 8 bits donde todo funcionaba con movimiento. Los molinos se detuvieron, los colores se apagaron y la gente se quedó quieta frente a sus pantallas.

Tú encontraste el **último Mazo del Movimiento**. Cada carta guarda un movimiento antiguo. Cuando lo haces y dices **¡Listo!**, una chispa de energía vuelve al reino: se enciende un farol, gira un molino, regresa un color.

**Logline:** *Una carta. Un movimiento. Un rincón del reino que vuelve a la vida.*

## 2. Tono

- Arcade amable, optimista, con humor ligero. Celebra lo pequeño («¡Snap!», «¡Combo!»).
- **Nunca** culpa, castiga ni habla del peso o la forma del cuerpo. Saltar una carta («Otro») es parte del juego, no un fracaso.
- Español neutro, frases cortas, segunda persona (tú).
- Referencias retro (8 y 16 bits, cartas coleccionables), pero **pulido**, no «MS-DOS».

## 3. Personajes y guías (propuesta, aún no aparecen en la app)

| Personaje | Rol | Uso posible en la app |
|-----------|-----|-----------------------|
| **El Jugador** (tú) | Portador del Mazo del Movimiento | Avatar en Progreso; «Crea tu héroe» en el login |
| **Bit**, el mapache mensajero | Guía y narrador; aparece en la bienvenida y en las felicitaciones | Burbuja de diálogo en onboarding, congrats y logros |
| **La Quietud** | Antagonista abstracta (niebla gris que congela) | Fondo apagado que se colorea con tu progreso |
| **Los Guardianes de familia** | Un guardián por grupo muscular, ilustrado en el marco de cada familia | Arte de familia en las cartas (director-creativo) |

## 4. Familias de cartas (una por grupo muscular)

El color de cada familia es **fijo** (las cartas son objetos físicos) y vive en `src/ui/styles/tokens.css` (`.fam-<grupo>`). Nombre e ícono en `content/story/pixelandia.json → families`.

| Grupo (id estable) | Nombre en la app (v0) | Ícono | Color | Idea de guardián / lore (propuesta) |
|--------------------|-----------------------|-------|-------|-------------------------------------|
| `piernas` | Piernas | 🦵 | Naranja | El Gigante de los Caminos: mueve la tierra con cada paso |
| `gluteos` | Glúteos | 🍑 | Rosa | La Reina del Puente: sostiene los puentes del reino |
| `empuje` | Empuje | ✋ | Amarillo | El Herrero del Sol: empuja las puertas del amanecer |
| `traccion` | Tracción | 🪢 | Azul | La Marinera de las Cuerdas: jala las velas del puerto |
| `core` | Core | 🛡️ | Verde | El Escudo del Bosque: el centro firme que protege |
| `movilidad` | Movilidad | 🌀 | Turquesa | La Bailarina del Viento: abre los caminos cerrados |
| `cardio` | Cardio | ❤️ | Morado | El Corazón del Volcán: da ritmo a todo el reino |

Los **ids** de grupo no cambian nunca (los usa el core). Los **nombres visibles** sí pueden cambiar (por ejemplo, «Clan del Gigante» en lugar de «Piernas»), pero deben seguir siendo claros para alguien que no conoce el lore. Recomendación: mostrar ambos («Gigante · Piernas») si el nombre temático no es obvio.

## 5. Niveles y rangos

- **Nivel de carta 1–10** (dificultad, lo define Entrenador). Se ve como «NV n» en la esquina de la carta y en los 10 pips del pie.
- **Rango (tier) por nivel**, que cambia el color del borde del marco:

| Tier | Niveles | Nombre v0 | Borde |
|------|---------|-----------|-------|
| 1 | 1–3 | Bronce | cobre |
| 2 | 4–6 | Plata | plata |
| 3 | 7–9 | Oro | oro |
| 4 | 10 | Leyenda | rosa brillante |

- **Nivel del jugador** por grupo y global: «tu nivel en Piernas: 3». Narrativamente, cada nivel global podría ser una **región** del reino que se descongela (propuesta: 1 Aldea, 2 Molinos, 3 Bosque, 4 Puerto, 5 Montaña, 6 Desierto, 7 Lago, 8 Volcán, 9 Nubes, 10 Castillo).

## 6. Cómo se conecta la historia con la mecánica

| Mecánica | Significado en el mundo | Pantalla / archivo |
|----------|-------------------------|--------------------|
| **Mazo** | El Mazo del Movimiento; se baraja con lo que tu nivel permite | `src/ui/views/card.js` |
| **Una carta en pantalla** | El movimiento que el reino necesita ahora | carta frente (`src/ui/card/frame.css`) |
| **Tocar la carta (volteo 3D)** | Leer el pergamino del movimiento: cómo se hace (video + pasos + cuidados) | reverso (`src/ui/card/back.css`) |
| **¡Listo!** | Liberas la energía de la carta: una chispa vuelve a Pixelandia | felicitación (`src/ui/views/reward.js`) |
| **Otro** | La carta vuelve al fondo del mazo; ningún castigo, el reino espera | animación «al fondo» (`src/ui/card/deck.css`) |
| **Barras de progreso** | Cuánta vida ha vuelto hoy (meta diaria), tu racha de fuego, tu fuerza por familia | secuencia de progreso |
| **Subir de nivel** | Un guardián de familia te reconoce; tu rango sube | pantalla de logros |
| **Insignias** | Sellos del reino (nombres en `badges`) | `#/logros` |
| **Racha** | La llama del farol: se mantiene encendida con al menos una carta al día; el comodín semanal es una «brasa de reserva» | HUD |
| **Recordatorios** | Bit te avisa que el reino necesita un movimiento | `reminders` |

## 7. Bienvenida (v0)

Ver `docs/story/WELCOME-COPY.md`.

## 8. Formato de `content/story/<id>.json`

Una historia = un archivo. La activa se elige en `content/story/active.json`. Para **previsualizar** otra sin cambiar la activa: `https://…/snapfit/?story=<id>` (o en local `http://localhost:5173/snapfit/?story=<id>`).

| Clave | Tipo | Reglas (las valida `tests/content/copy-story.test.js`) |
|-------|------|----------------------------------------------------------|
| `id` | string | igual al nombre del archivo |
| `version`, `status`, `author` | string | metadatos |
| `title`, `logline` | string | — |
| `welcome.lines` | string[] | 1–5 líneas |
| `welcome.cta` | string | ≤ 28 caracteres (cabe en el botón) |
| `welcome.title`, `welcome.note` | string | — |
| `signin.title`, `signin.body`, `signin.offline` | string | `offline` admite `<b>` |
| `deckReady.title` | string | — |
| `families.<grupo>.name`, `.icon` | string | los 7 grupos |
| `tiers.1..4` | string | — |
| `rewards` | string[] | títulos aleatorios de felicitación |
| `reminders` | string[] | textos de recordatorio |
| `badges.<id>.name`, `.desc` | string | todas las insignias de `src/core/achievements.js → BADGE_IDS` |
