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
| `public/stories/pixelandia/preview.jpg` | vista previa del paquete de historia (selector) | Codelius (Grok Bot) | Recorte con Pillow de `docs/evidence/f2b/01-bienvenida-historia-390x844.png` (captura de la app con `scripts/screens.mjs`) | Recorte de la zona de las mini cartas, reducido a 480 px | 2026-10-03 | CC BY 4.0 | Paquete `content/stories/pixelandia` (placeholder) |
| `public/stories/valle-gremios/preview.jpg` | vista previa del paquete de historia (selector) | Codelius (Grok Bot) | Derivado con Pillow de `docs/proposals/ui/cartas-modelo/B-pixelandia.jpg` (Grok Bot GenerateImage, modelo de generación de imágenes) | Imagen completa reducida a 480 px de ancho | 2026-10-03 | CC BY 4.0 | Paquete `content/stories/valle-gremios`; arte de propuesta, no final |
| `public/stories/valle-gremios/art/sentadilla-silla-l1.jpg` | ilustración de carta (paquete valle-gremios, carta `sentadilla-silla-l1`) | Codelius (Grok Bot) | Derivado con Pillow de `docs/proposals/ui/cartas-modelo/B-pixelandia.jpg` (Grok Bot GenerateImage) | Recorte de la ilustración (x 250–690, y 45–365) a 440×320 | 2026-10-03 | CC BY 4.0 | Prueba de arte por paquete; director-creativo (t_7db959be) entregará el arte final con QA multimodal |
| `public/stories/vitalia/preview.jpg` | vista previa del paquete de historia vitalia (selector) — **provisional** | Codelius (Grok Bot) | Copia de `public/stories/valle-gremios/preview.jpg` (derivado de `docs/proposals/ui/cartas-modelo/B-pixelandia.jpg`, Grok Bot GenerateImage) | Copia sin cambios | 2026-10-03 | CC BY 4.0 | Reutilizada hasta tener arte propio de Vitalia |
| `public/stories/vitalia/art/sentadilla-silla-l1.jpg` | ilustración de carta (paquete vitalia, carta `sentadilla-silla-l1`) — **provisional** | Codelius (Grok Bot) | Copia de `public/stories/valle-gremios/art/sentadilla-silla-l1.jpg` (derivado de `B-pixelandia.jpg`, Grok Bot GenerateImage) | Copia sin cambios | 2026-10-03 | CC BY 4.0 | Arte reutilizado de valle-gremios; director-creativo (t_7db959be) entregará el arte final |

### Ejemplo de fila

| `public/assets/sprites/sentadilla-silla-l1.png` | sprite 8×32 px | director-creativo | Grok Bot (imagen) + limpieza en LibreSprite | «pixel art 32x32, personaje… sentadilla a silla, 8 frames» (prompt completo en el adjunto Kanban t_xxx) | 2026-10-05 | CC BY 4.0 | Tarjeta Kanban t_xxx |

| `docs/proposals/ui/cartas-modelo/A-arcade-dojo.jpg` | Propuesta de carta (mundo A) | Codelius | Grok Bot GenerateImage (modelo de generación de imágenes) | 2026-10-03 | CC BY 4.0 | Solo propuesta, no se usa en la app |
| `docs/proposals/ui/cartas-modelo/B-pixelandia.jpg` | Propuesta de carta (mundo B, el elegido) | Codelius | Grok Bot GenerateImage | 2026-10-03 | CC BY 4.0 | Referencia de estilo para disenador y director-creativo |
| `docs/proposals/ui/cartas-modelo/C-orbita.jpg` | Propuesta de carta (mundo C) | Codelius | Grok Bot GenerateImage | 2026-10-03 | CC BY 4.0 | Solo propuesta |
