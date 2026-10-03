# Procedencia de assets

**Obligatorio** (ver `CONTRIBUTING.md`): cada imagen, sprite, ícono, fuente, sonido o música del repo tiene **una fila** aquí, agregada en el mismo commit que el archivo.

- **Licencia por defecto** de los assets propios: **CC BY 4.0**, con atribución «SnapFit — jjmbrooks y colaboradores».
- **Coste:** solo se usan la cuota de Grok Bot, Xiaomi MiMo o herramientas libres. Cualquier pago requiere el OK de Brooks.
- Los assets de terceros solo se aceptan con licencia compatible (CC0, CC BY o OFL para fuentes) y con su URL de origen.

| Archivo (ruta en repo) | Tipo | Autor (persona/agente) | Herramienta / modelo | Prompt o método | Fecha | Licencia | Origen / notas |
|------------------------|------|------------------------|----------------------|-----------------|-------|----------|----------------|
| `public/fonts/PressStart2P-Regular.ttf` | fuente pixel (solo títulos) | CodeMan38 / The Press Start 2P Project Authors | — (tercero) | Descargada de github.com/google/fonts `ofl/pressstart2p/` · sha256 `034c77f1…e017d` | 2026-10-03 | **SIL OFL 1.1** (no CC BY) | Licencia completa en `public/fonts/OFL-PressStart2P.txt` |
| `public/icons/icon-192.png` | ícono PWA | Codelius (Grok Bot) | Generado por código: `scripts/gen-icons.mjs` (Node + zlib) | Patrón pixel 16×16 escrito a mano en el script, escalado sin suavizado | 2026-10-03 | CC BY 4.0 | Placeholder hasta el arte de director-creativo (t_7db959be) |
| `public/icons/icon-512.png` | ícono PWA | Codelius (Grok Bot) | Generado por código: `scripts/gen-icons.mjs` | Igual que el anterior | 2026-10-03 | CC BY 4.0 | Placeholder |
| `public/icons/icon-maskable-512.png` | ícono PWA maskable | Codelius (Grok Bot) | Generado por código: `scripts/gen-icons.mjs` | Igual, con margen de 12 % (zona segura) | 2026-10-03 | CC BY 4.0 | Placeholder |
| _(sin archivo)_ `src/ui/components/sprite.js` → `ANIMS` | animaciones pixel de las 12 cartas borrador | Codelius (Grok Bot) | Generado por código en tiempo de ejecución (Canvas 2D 32×32) | Poses de articulaciones escritas a mano + interpolación + Bresenham | 2026-10-03 | MIT (código) / CC BY 4.0 (diseño) | Placeholder hasta sprites de director-creativo |
| _(sin archivo)_ `src/ui/components/sprite.js` → `drawBadge` | insignias pixel 16×16 | Codelius (Grok Bot) | Generado por código (Canvas 2D) | Marco octogonal + glifo simétrico derivado del hash del id | 2026-10-03 | MIT / CC BY 4.0 | Placeholder hasta arte de director-creativo |
| _(sin archivo)_ `src/ui/components/sfx.js` | SFX chiptune (listo, otra, logro, nivel) | Codelius (Grok Bot) | Sintetizados con WebAudio (onda cuadrada) | Secuencias de notas escritas a mano | 2026-10-03 | MIT / CC BY 4.0 | Placeholder hasta SFX de melody (t_b20e2d87) |
| `docs/evidence/*.png` | capturas de pantalla | Codelius (Grok Bot) | `scripts/screens.mjs` (Chrome headless, playwright-core) | Capturas automáticas 390×844 del build | 2026-10-03 | CC BY 4.0 | Evidencia de fase |

### Ejemplo de fila

| `public/assets/sprites/sentadilla-silla-l1.png` | sprite 8×32 px | director-creativo | Grok Bot (imagen) + limpieza en LibreSprite | «pixel art 32x32, personaje… sentadilla a silla, 8 frames» (prompt completo en el adjunto Kanban t_xxx) | 2026-10-05 | CC BY 4.0 | Tarjeta Kanban t_xxx |
