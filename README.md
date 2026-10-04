# SnapFit 🕹️💪

**Un mazo de cartas de ejercicio estilo videojuego retro.** Abres la app, aparece **una carta**, haces el movimiento y tocas **¡Listo!**. Con eso basta.

PWA *mobile-first*, instalable en Android (Chrome), **funciona sin conexión** y está pensada para la conectividad irregular de La Unión, Guerrero. Ofrece microsesiones de calistenia y ejercicios con el propio peso para todo el cuerpo, **basadas en evidencia** (estudios revisados por pares o técnicas documentadas de dominio público) y sin equipo: en casa, la oficina, el parque o donde sea.

> Antes se llamaba «Bocaditos» (idea de Entrenador / Body Lab, 2026-10-03).

## Estado

**F1 cerrada, F2 avanzada (2026-10-03).** La PWA ya se puede jugar: carta → ¡Listo!, racha, niveles, insignias, temas, recordatorios locales y sincronización opcional. Usa **12 cartas borrador** hasta recibir el contenido validado de Entrenador. Ver [`docs/05-ROADMAP.md`](docs/05-ROADMAP.md).

- **Jugar:** https://jjmbrooks.github.io/snapfit/ (en Android Chrome: menú → «Instalar app»)
- Repo: https://github.com/jjmbrooks/snapfit
- Privacidad: [`docs/PRIVACY.md`](docs/PRIVACY.md)

## Desarrollo

```bash
npm install
npm run dev              # http://localhost:5173/snapfit/
npm test                 # core puro (vitest) + contraste AA de temas
npm run check:content    # valida cartas
npm run check:provenance # assets con procedencia
npm run build && npm run preview
npm run verify           # tests + contenido + procedencia + build
npm run screens -- http://localhost:4173/snapfit/ /tmp/capturas   # 18 capturas 390×844 (con preview corriendo)
```

**¿Vas a mejorar la historia o la UI?** Lee [`docs/PARALLEL-WORK.md`](docs/PARALLEL-WORK.md): cada workstream tiene sus archivos, se trabaja en ramas `<workstream>/<modelo>-<tema>` y se entra a `main` por PR revisado por Codelius. Historia: [`docs/story/`](docs/story/). Textos: `content/copy/es.json` y `content/story/*.json`.

## Lo esencial

| | |
|---|---|
| Experiencia | Una carta → hazla → **¡Listo!** (felicitación y progreso) o **Otro** (la carta va al fondo del mazo). Toca la carta para voltearla y ver cómo se hace |
| Juego | Pixel-art retro, animación por carta, racha diaria, insignias, logros, compartir logros |
| Niveles | 10 niveles; la app calcula tu nivel con tu progreso (también por grupo muscular) |
| Temas | 6 temas: Medianoche 8-bit, Mañana Pixel, Chicle Turbo, Selva Guerrera, Ola Pacífico, Volcán Power |
| Datos | Local primero (IndexedDB). Sincronización opcional con Google Sign-In + Firestore (plan Spark gratuito) |
| Stack | Vite + JS vanilla + tokens CSS + sprites Canvas/CSS + Service Worker + Firebase JS SDK modular |
| Hosting | GitHub Pages (`/snapfit/`) con GitHub Actions |

## Documentación (léela en orden)

1. [`AGENTS.md`](AGENTS.md): instrucciones para bots
2. [`docs/00-VISION.md`](docs/00-VISION.md)
3. [`docs/01-PRODUCT.md`](docs/01-PRODUCT.md): UX, pantallas, mecánicas, insignias, temas
4. [`docs/02-ARCHITECTURE.md`](docs/02-ARCHITECTURE.md): módulos, datos, Firestore, offline, notificaciones
5. [`docs/03-CONTENT.md`](docs/03-CONTENT.md): schema de cartas y mazos
6. [`docs/04-SCIENCE.md`](docs/04-SCIENCE.md) → [`docs/training/`](docs/training/)
7. [`docs/05-ROADMAP.md`](docs/05-ROADMAP.md): fases, DoD y bitácora de consumo
8. [`docs/06-ROLES.md`](docs/06-ROLES.md)
9. [`docs/07-HANDOFF.md`](docs/07-HANDOFF.md)
10. [`docs/PARALLEL-WORK.md`](docs/PARALLEL-WORK.md): trabajo en paralelo (ramas, PR, workstreams)
11. [`docs/story/`](docs/story/): mundo, bienvenida y microcopy (v0)
12. [`docs/ASSETS-PROVENANCE.md`](docs/ASSETS-PROVENANCE.md)

## Aviso de salud

SnapFit ofrece información general de actividad física. **No sustituye una valoración médica.** Si tienes una lesión, dolor, una enfermedad cardiovascular o un embarazo, consulta a un profesional antes de empezar. Detén el ejercicio si sientes dolor agudo, mareo o falta de aire anormal.

## Licencias

- Código: **MIT**. Ver [`LICENSE`](LICENSE).
- Contenido y assets (cartas, textos de entrenamiento, sprites, sonidos): **CC BY 4.0**, con atribución obligatoria. Ver [`LICENSE-ASSETS.md`](LICENSE-ASSETS.md).

© 2026 jjmbrooks (Jhonatan Jesús Martínez Brooks)
