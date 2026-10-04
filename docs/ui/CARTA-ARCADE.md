# Carta vertical «grimorio arcade» (estilo C)

> Elegido por Brooks el 2026-10-03. Implementado por Codelius en CSS/SVG: marco, textos, gemas, escudos y emblemas son código, no imágenes generadas. Las imágenes generadas solo se usan como **ilustración** y **poses**, y son provisionales.
> Referencias en `docs/proposals/ui/cartas-vitalia/`: `vitalia-C-vertical.png` (frente), `vitalia-C-reverso.jpg` (reverso; es horizontal, el nuestro es vertical), `kit-ui-vitalia.jpg` (kit de interfaz) y `hoja-aprendiz.jpg` (personaje).

## Archivos

| Qué | Dónde |
|-----|-------|
| Componente (HTML del frente y el reverso, volteo) | `src/ui/components/tcard.js` |
| Datos de carta (pasos, flavor, respiración, dosis, rango) y validación | `src/ui/card/card-data.js` |
| Emblemas SVG por grupo muscular (respaldo genérico) | `src/ui/card/emblems.js` |
| Estilos del frente / reverso / volteo / mazo | `src/ui/card/frame.css`, `back.css`, `flip.css`, `deck.css` |
| Tokens: escuelas, rangos, pergamino, madera, brillo | `src/ui/styles/tokens.css` §3–4 |
| Piel «grimorio» de botones, barras y barra inferior | `src/ui/styles/grimorio.css` |
| Galería de rangos (solo lectura) | `#/muestra/<cardId>/<nivel>` · capturas: `node scripts/card-shots.mjs <url> <dir>` |

## Anatomía (proporción 5:7, medidas en `cqi` = % del ancho de la carta)

**Frente**
1. **Gema de rango** (arriba a la izquierda): hexágono con el metal del rango y el **nivel** de la carta (1–10).
2. **Estandarte** con el título (`name`, máx. 2 líneas).
3. **Emblema de escuela** (arriba a la derecha): círculo con el color de la escuela y su símbolo SVG. Un paquete puede usar imágenes (`manifest.assets.emblems`).
4. **Ventana de ilustración**: `cardArt` del paquete. Si no hay, se muestra la animación procedural.
5. **Pergamino**: «Rango · Escuela» (textos del paquete), dosis «series × reps», ambientación opcional y los grupos musculares en texto neutro (siempre visibles).
6. **Escudo de XP** (abajo a la izquierda): XP al completarla (`xpForCard(nivel)` del core).

**Reverso** (se muestra al tocar la carta; sustituye a la ranura de video)
1. **Estandarte**: `story.cardBack.title` del paquete (Vitalia: «Cómo lanzar el hechizo»). Si falta: «Cómo se hace».
2. **3 filas de paso**: escudo numerado, ranura de pose (pose del paquete → `steps[].pose` de la carta → silueta «pose pendiente») y la instrucción.
3. **Tira inferior**: dosis + respiración (`breath` de la carta → `cardBack.breath` del paquete → texto de la interfaz).
4. **Cuidados** (zonas y contraindicaciones) y enlace a la ficha completa con fuentes. Se mantienen por seguridad, aunque no aparecen en la referencia.

## Rangos (comparten el marco; cambia el metal)

| Rango | Niveles | Nombre visible (Vitalia) | Token | Claro / oscuro |
|-------|---------|--------------------------|-------|----------------|
| 1 | 1–3 | Aprendiz | `--rank-bronce` `#c8803e` | `#e0a061` / `#6b3a14` |
| 2 | 4–6 | Adepto | `--rank-plata` `#b8c1ce` | `#dfe5ee` / `#5d6878` |
| 3 | 7–9 | Magister | `--rank-oro` `#e8b931` | `#f5cd4c` / `#8a6205` |
| 4 | 10 | Archimago | `--rank-gema` `#b25cf0` | `#c98bf5` / `#5a1f8f` |

En el kit la gema «Bronce» está dibujada en verde; en el código es **bronce de verdad**. El texto del rango sale de `story.json → tiers` (otros paquetes: Bronce/Plata/…).

## Colores de escuela (por id de grupo muscular, fijos)

| id | Escuela (Vitalia) | `--fam` | `--fam-dark` | `--fam-ink` | Tinta/color | Blanco/oscuro |
|----|-------------------|---------|--------------|-------------|-------------|---------------|
| `piernas` | Raíz · verde | `#4cae4f` | `#1e5e24` | `#04200a` | 6.2:1 | 7.8:1 |
| `gluteos` | Arco · naranja | `#f0883a` | `#8f4210` | `#2a1200` | 7.0:1 | 7.1:1 |
| `empuje` | Palma · rojo | `#e5524b` | `#8c1f1a` | `#2a0503` | 5.0:1 | 9.0:1 |
| `traccion` | Cuerda · azul | `#4a90e2` | `#1a4f92` | `#021529` | 5.6:1 | 8.2:1 |
| `core` | Sello · morado | `#9d6fe3` | `#4f2c92` | `#160530` | 5.3:1 | 10.0:1 |
| `movilidad` | Nudo · turquesa | `#22b3a6` | `#0e6a62` | `#01201d` | 6.6:1 | 6.5:1 |
| `cardio` | Latido · rosa | `#ec5f9e` | `#8f1f57` | `#2a0315` | 6.0:1 | 8.4:1 |

Los colores siguen el kit de Vitalia. El contraste (tinta ≥ 4.5:1, blanco sobre oscuro ≥ 3:1; rangos y pergamino) lo verifica `tests/ui/contrast.test.js`. Los emblemas son decorativos (`aria-hidden`): el nombre de la escuela siempre aparece en texto.

## Assets configurables (dónde dejar el arte nuevo)

El arte de un estilo o personaje va en **`public/art/<carpeta>/`** (Vitalia: `public/art/vitalia/`), con su fila en `docs/ASSETS-PROVENANCE.md`. Se conecta desde el manifest del paquete con rutas absolutas `/art/…`:

```json
"assets": {
  "cardArt": { "sentadilla-silla-l1": "/art/vitalia/cards/sentadilla-silla-l1.jpg" },
  "poses":   { "sentadilla-silla-l1": ["/art/vitalia/poses/sentadilla-silla-l1-1.webp", "…-2.webp", "…-3.webp"] },
  "emblems": { "piernas": "/art/vitalia/icons/raiz.png" }
}
```

Estructura sugerida: `public/art/vitalia/{cards,poses,icons,character}/`. Para cambiar una imagen basta con dejar el archivo, editar la ruta en `content/stories/vitalia/manifest.json` y añadir la fila de procedencia. No hace falta tocar código. El arte, las poses, los emblemas, los marcos y la ambientación **no se heredan** del paquete por defecto: Pixelandia nunca muestra el arte de Vitalia. Estos assets no van al precache: se cargan cuando se ven y el SW cachea los del paquete activo.

## Pendiente

- Las poses de `sentadilla-silla-l1` ya son **finales** (WebP en `public/art/vitalia/poses/`). Faltan la ilustración final y las poses del resto de cartas.
- El título de la carta usa `name` («Sentadilla a la silla»). Un nombre temático por historia («Sentadilla de la Raíz») requeriría un campo nuevo en el paquete (`cardTitles`), que todavía no existe.
- La piel «grimorio» de botones, barras y barra inferior se aplica con cualquier tema. Si se quiere solo con Vitalia, se puede limitar a `[data-story='vitalia']`.
