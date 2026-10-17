# Diseño · auditoría y mejoras con Impeccable

**Fecha:** 2026-10-03 · **Rama:** `ui/codelius-impeccable-videos` · **Herramienta:** Impeccable v4.6.0, de Paul Bakaus
(Apache-2.0, ver NOTICE.md), clonada en `/workspace/tools/impeccable`.

Encargo de Brooks: auditar y mejorar la interfaz con Impeccable sin perder el estilo de carta «grimorio arcade»
ni la separación entre historia y lógica (ADR-011).

## 1. Comandos ejecutados

```bash
I=/workspace/tools/impeccable/.agents/skills/impeccable/scripts/impeccable
$I context                                   # carga de contexto (sin PRODUCT.md al inicio → init)
# init/document → PRODUCT.md y DESIGN.md en la raíz del repo
npm run build && npx vite preview --port 4173 &
$I detect src index.html                     # escaneo estático (CSS/JS)
$I detect --json --viewport 390x844 http://localhost:4173/snapfit/
$I detect --json --viewport 390x844 "http://localhost:4173/snapfit/#/muestra/sentadilla-silla-l1/1"
#   …y lo mismo a 360x780 y 430x932 (resultados en docs/evidence/impeccable/detector-*.json|txt)
node scripts/screens.mjs http://localhost:4173/snapfit/ docs/evidence/impeccable/{antes,despues} 390x844|360x780|430x932
```

Las capturas «antes» se tomaron a 390×844 y 360×780 sobre `main` antes de los cambios. Las de «después», a
390×844, 360×780 y 430×932 (18 pantallas del flujo cada una), más el reverso de cartas con y sin video.

Las capturas se guardan en WebP a 1× (las originales eran PNG a 2×) para no inflar el repositorio: pasaron de 34 MB a 4 MB.

**Entrevista:** el flujo `init` de Impeccable pide preguntar al usuario una vez. En esta sesión no hubo un canal
para hacerlo, así que PRODUCT.md marca como **(inferido)** lo que se dedujo del encargo y de los documentos. Brooks
debe confirmarlo.

## 2. Detector CLI · antes → después

| Objetivo | Antes | Después |
|---|---|---|
| `detect src index.html` (estático) | **2** (side-tab en `.notice`, gradient-text en logo de Google) + 3 avisos de rebote | **0** (exit 0) |
| Bienvenida 390×844 | 3 (paleta IA, crema, texto de 10 px) | 2 (paleta IA*, crema*) |
| Bienvenida 360×780 | 3 | 2* |
| Carta muestra 390×844 | 7 + 3 avisos (texto de 10 y 7.5 px, padding apretado, glow sin desplazamiento, crema, tarjetas anidadas, rebote, rayas, jerarquía plana) | 2* + 2 avisos* |
| Carta muestra 360×780 | 6 + 3 avisos | 2* + 2 avisos* |
| Carta muestra 430×932 | — | 2* + 1 aviso* |

\* **Hallazgos aceptados (el encargo manda sobre la regla genérica):**
- *ai-color-palette*: el «degradado morado» es la mini‑carta de la **Escuela del Sello** (core), cuyo color es parte
  del sistema de escuelas. No es decoración.
- *cream-palette*: el navegador del detector pide esquema claro y la app aplica el tema «mañana» (#f4f1e8), que es
  uno de los 6 temas. El tema por defecto es «medianoche».
- *nested-cards*: el pergamino dentro de la carta es el diseño de carta C que aprobó Brooks.
- *repeating-stripes-gradient*: textura del 6 % en el marco de la carta, sacada del kit Vitalia. Se quitó del dorso del mazo.
- *flat-type-hierarchy*: medido en la ruta de muestra, donde los únicos h2/h3 son los títulos de la carta (escalados con `cqi`).

## 3. Puntuaciones

### Audit (5 dimensiones, 0–4)

| Dimensión | Antes | Después | Motivo |
|---|---|---|---|
| Accesibilidad | 2 | 3 | Texto < 11 px (HUD, insignias de 9 px, BORRADOR de 7.5 px); enlaces de la cara oculta de la carta enfocables; **Enter sobre «Ficha completa» volteaba la carta en vez de abrir el enlace**; progreso del onboarding sin texto; error sin foco. Todo corregido. Falta una prueba con lector de pantalla real. |
| Rendimiento | 3 | 3 | Sin cambios de peso: el arte sigue fuera del precache y la lista de arte es un módulo virtual de pocos bytes. El SDK de Firebase sigue siendo el chunk mayor. |
| Theming | 3 | 3 | Tokens nuevos `--ease-out` y `--text-floor`. Quedan colores fijos del grimorio (intencionales, documentados en DESIGN.md). |
| Responsive (360–430) | 3 | 4 | 0 desbordes en el reverso de las 12 cartas a 360, 390 y 430; textos con piso `max(11px, Ncqi)`. |
| Integridad de implementación | 2 | 3 | Fuera franja lateral, texto con degradado, rebotes, rayas del dorso y glow de la ventana. Iconos de la barra inferior en SVG en lugar de emoji. |
| **Total** | **13/20 · Aceptable** | **16/20 · Bueno** | |

Problemas por severidad antes: P0 0 · P1 3 (texto < 11 px, teclado/Enter en enlaces de la carta, foco en cara oculta) ·
P2 5 · P3 4. Después: P0 0 · P1 0 · P2 3 · P3 3 (ver §5).

### Critique (10 heurísticas de Nielsen, 0–4)

| # | Heurística | Antes | Después |
|---|---|---|---|
| 1 | Visibilidad del estado | 3 | 3 |
| 2 | Lenguaje del mundo real | 3 | 3 |
| 3 | Control y libertad | 3 | 3 |
| 4 | Consistencia y estándares | 2 | 3 |
| 5 | Prevención de errores | 3 | 3 |
| 6 | Reconocer antes que recordar | 3 | 3 |
| 7 | Flexibilidad y eficiencia | 2 | 2 |
| 8 | Estética y minimalismo | 3 | 3 |
| 9 | Recuperación de errores | 2 | 3 |
| 10 | Ayuda y documentación | 2 | 3 |
| | **Total** | **26/40** | **29/40** |

Veredicto de especificidad: **específico**. La carta grimorio con escuelas y rangos no se parece a una plantilla
genérica de fitness, así que el trabajo fue de *pulido*, no de rediseño.

## 4. Cambios por verbo

- **typeset:** piso de texto de 11 px (`--text-floor`) en HUD, leyendas, toasts, subtítulo de bienvenida, chips de
  nivel, niveles de progreso, BORRADOR, línea de grupos y ambientación de la carta. Los nombres de insignia pasan
  de pixel 9 px a Georgia 800 14 px (legibles y con el estilo grimorio).
- **layout:** reverso de carta con una fila más («Ver video») sin desbordes a 360–430. Padding vertical del
  estandarte de mínimo 6 px. Dorso del mazo en madera con ribete (antes, rayas grises).
- **onboard (bienvenida → Google → perfil → mazo → aviso de salud):** indicador «Paso n de 4» accesible en los
  puntos y «Parte n de 4» visible en el perfil. Logo de Google en SVG oficial (antes era texto con degradado).
  `aria-busy` mientras se inicia sesión.
- **harden:** errores de Google traducidos (`auth/network-request-failed`, `auth/popup-blocked`, ventana cerrada)
  en vez de mostrar el código crudo. El foco va al mensaje de error. `overflow-wrap` en títulos, avisos y toasts.
  El aviso «sin conexión» usa `role=status`. El enlace de video recorta con elipsis si la fuente es larga.
- **polish:** easing único `--ease-out` (sin rebote) en reparto, volteo y recompensa. La animación `pop` ya no se
  pasa de escala. Con «reducir movimiento» se anulan también retrasos e iteraciones. Iconos SVG pixel en la barra
  inferior. Aviso de salud con borde completo (sin franja lateral).
- **a11y de la carta:** los enlaces de la cara oculta tienen `tabindex=-1` y se activan al voltear. Enter o Espacio
  sobre un enlace ya no voltea la carta.

## 5. Pendiente (no bloquea)

- P2: emojis de las escuelas en algunos chips (`FAMILY_ICONS` del paquete) y en el HUD de racha. Para
  reemplazarlos por emblemas SVG hay que tocar los paquetes de historia.
- P2: el título de pantalla en pixel (Press Start 2P) se lee pesado con acentos («Únete…»). Valorar Georgia para títulos largos.
- P2: el chunk de Firebase (≈ 450 KB, 112 KB gzip). Ya se carga en diferido; revisar `firebase/firestore/lite`.
- P3: heurística 7 (atajos): no hay gesto de deslizar para ¡Listo!/Otro.
- P3: confirmar PRODUCT.md con Brooks (hechos inferidos).
- P3: prueba con TalkBack o VoiceOver en un dispositivo real.
