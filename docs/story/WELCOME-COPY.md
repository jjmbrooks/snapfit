# Copy de bienvenida y onboarding

> **v0 · BORRADOR ABIERTO A PROPUESTAS.** Fuente en la app: `content/story/pixelandia.json` (narrativa) y `content/copy/es.json → onboarding` (interfaz). Propuestas alternativas: `docs/proposals/story/<modelo>.md` o una historia nueva en `content/story/<id>.json` (se previsualiza con `?story=<id>`).

## Flujo (4 pasos, sin barra inferior)

1. **Bienvenida** (historia) → 2. **Entrar con Google** → 3. **Perfil** (sobre ti, condición, prueba rápida, mazo listo) → 4. **Aviso de salud** → carta.

## 1. Bienvenida — `welcome`

- **Título:** El Reino de Pixelandia
- **Líneas** (aparecen una tras otra):
  1. La Gran Quietud congeló a Pixelandia: nadie se mueve, todo se apaga.
  2. Tú tienes el último Mazo del Movimiento. Cada carta que juegas devuelve la vida a un rincón del reino.
  3. Una carta. Un movimiento. ¡Listo!
- **Botón:** Comenzar la aventura ▶
- **Nota:** Historia provisional · el mundo final lo escribe storyteller.

Arriba se ven tres mini cartas animadas (piernas, core, empuje) con la animación provisional.

## 2. Entrar con Google — `signin`

- **Título:** Crea tu héroe
- **Texto:** Entra con tu cuenta de Google para guardar tu mazo, tu nivel y tus logros, y recuperarlos en cualquier teléfono.
- **Nota:** Después del primer inicio de sesión, SnapFit funciona también **sin internet**.
- Botón y errores: `content/copy/es.json → onboarding.googleButton`, `needOnline`, `popupClosed`, `signinError`.

## 3. Perfil — `content/copy/es.json → onboarding.*`, `names.sexes`, `names.fitness`, `quickTest`

- Sobre ti (edad, sexo) → Tu condición física → Prueba rápida (3 preguntas; **contenido de Entrenador**, no cambiar rangos sin su OK) → **«Tu mazo está listo»** (`deckReady.title`) con el nivel inicial por familia.

## 4. Aviso de salud — `onboarding.terms*`

El texto de salud es **legal/seguridad**: se puede mejorar el estilo, pero no quitar ninguna de sus ideas (no sustituye valoración médica; consultar si hay lesión, dolor, enfermedad cardiovascular o embarazo; detenerse ante dolor agudo, mareo o falta de aire).

## Cómo proponer

1. Copia `content/story/pixelandia.json` a `content/story/<tu-id>.json`, cambia `id` y los textos.
2. `npm test` (valida el formato) y `npm run dev` → abre `/snapfit/?story=<tu-id>`.
3. Capturas: `npm run screens -- "http://localhost:4173/snapfit/?story=<tu-id>" docs/proposals/story/<tu-id>/` (con `npm run build && npm run preview` corriendo).
4. PR `story/<modelo>-<tema>` con el JSON, una ficha en `docs/proposals/story/<modelo>.md` y las capturas. **No** cambies `active.json`: eso lo decide Brooks.
