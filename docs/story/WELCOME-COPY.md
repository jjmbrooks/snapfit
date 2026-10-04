# Copy de bienvenida y onboarding

> **v2 · Vitalia (elegida por Brooks, 2026-10-03).** Fuente en la app: el paquete de historia activo, `content/stories/<id>/story.json` (narrativa; ver `docs/story/STORY-PACKS.md`) y `content/copy/es.json → onboarding` (interfaz). Propuestas alternativas: `docs/proposals/story/<modelo>.md` o un paquete nuevo en `content/stories/<id>/` (se previsualiza con `?story=<id>`).

## Flujo (4 pasos, sin barra inferior)

1. **Bienvenida** (historia) → 2. **Entrar con Google** → 3. **Perfil** (sobre ti, condición, prueba rápida, mazo listo) → 4. **Aviso de salud** → carta.

## 1. Bienvenida — `welcome` (paquete por defecto: `vitalia`)

- **Título:** El Reino de Vitalia
- **Líneas** (aparecen una tras otra; texto de storyteller, `docs/proposals/story/storyteller-magia.md` §4.1):
  1. La Quietud cubrió Vitalia de niebla: las forjas se apagaron y los pasos se detuvieron.
  2. Los siete gremios guardaron los hechizos de la Orden del Aliento en un mazo…
  3. Ese mazo te eligió a ti: cada carta que lanzas devuelve luz al reino.
  4. Empiezas como aprendiz. Con cada nivel, un hechizo más grande.
  5. Soy Pip. Te acompaño. ¿Lanzamos el primero?
- **Botón:** Despertar el mazo (17/28)
- **Nota:** Un aliento basta para empezar.

Otros paquetes instalados: `pixelandia` (botón «Comenzar la aventura ▶») y `valle-gremios` (botón «¡Abrir el mazo!»). Su texto está en `content/stories/<id>/story.json` y se previsualiza con `?story=<id>`.

Arriba se ven tres mini cartas animadas (piernas, core, empuje) con la animación provisional.

## 2. Entrar con Google — `signin`

- **Título (vitalia):** Únete a la Orden
- **Texto:** Entra con tu cuenta de Google para guardar tu mazo, tus rangos y tus sellos, y recuperarlos en cualquier teléfono.
- **Nota:** Después del primer inicio de sesión, Vitalia te espera también **sin internet**.
- Botón y errores: `content/copy/es.json → onboarding.googleButton`, `needOnline`, `popupClosed`, `signinError`.

## 3. Perfil — `content/copy/es.json → onboarding.*`, `names.sexes`, `names.fitness`, `quickTest`

- Sobre ti (edad, sexo) → Tu condición física → Prueba rápida (3 preguntas; **contenido de Entrenador**, no cambiar rangos sin su OK) → **«Tu mazo está listo»** (`deckReady.title`; en vitalia: «El grimorio te reconoce») con el nivel inicial por familia.

## 4. Aviso de salud — `onboarding.terms*`

El texto de salud es **legal/seguridad**: se puede mejorar el estilo, pero no quitar ninguna de sus ideas (no sustituye valoración médica; consultar si hay lesión, dolor, enfermedad cardiovascular o embarazo; detenerse ante dolor agudo, mareo o falta de aire).

## Cómo proponer

1. Crea un paquete: copia `content/stories/valle-gremios/` a `content/stories/<tu-id>/`, cambia `id` y los textos (guía: `docs/story/STORY-PACKS.md`).
2. `npm test` (valida el formato) y `npm run dev` → abre `/snapfit/?story=<tu-id>`.
3. Capturas: `npm run screens:stories -- http://localhost:4173/snapfit/ docs/proposals/story/<tu-id>/ sentadilla-silla-l1 <tu-id>` (con `npm run build && npm run preview` corriendo).
4. PR `story/<modelo>-<tema>` con el JSON, una ficha en `docs/proposals/story/<modelo>.md` y las capturas. **No** cambies `content/stories/index.json`: el paquete por defecto lo decide Brooks.
