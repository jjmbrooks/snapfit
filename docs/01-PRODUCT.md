# 01: Producto (UX, pantallas, mecánicas, insignias, temas)

## 1. Flujo núcleo

```
Abrir app ──► CARTA (inmediata, sin login, sin splash > 1 s)
               ├─ [¡Listo!]     → animación de recompensa (+XP, círculo del día) → siguiente carta opcional
               ├─ [Otra carta]  → baraja otra (sin penalización; cuenta "saltos" para el motor)
               └─ (opcional) ¿Cómo estuvo?  😌 fácil · 🙂 bien · 😤 duro   (1 toque, se puede omitir)
Barra inferior siempre visible: [Carta] [Progreso] [Menú]
```

- La carta aparece en **menos de 1 s** desde el caché (Service Worker + IndexedDB).
- La **retroalimentación de esfuerzo** (fácil/bien/duro) es opcional y alimenta la nivelación (ver `02-ARCHITECTURE.md` §5).
- Los targets táctiles miden **48 px o más**, el diseño se usa con una mano, se respeta el *safe-area* y no hay overflow en pantallas de 360 px.

## 2. Pantallas (rutas hash)

| Ruta | Pantalla | Contenido |
|------|----------|-----------|
| `#/` | **Carta** | Sprite animado del movimiento, nombre, dosis (reps o segundos), grupo muscular, ícono de lugar, aviso de zonas a cuidar, botones ¡Listo! / Otra carta, temporizador opcional si la carta es por tiempo |
| `#/carta/:id` | Detalle de carta | Pasos, variantes más fácil y más difícil, contraindicaciones, fuentes (citas) |
| `#/progreso` | **Progreso** | Mazo del día (círculos), racha, nivel global y nivel por grupo (barras pixel), historial de 7 y 30 días, insignias |
| `#/logros` | Logros | Vitrina de insignias (bloqueadas en silueta), botón **Compartir** |
| `#/menu` | **Menú / Personalización** | Tema, lugar (casa/oficina/parque/aula), zonas a cuidar, mazo activo, recordatorios, sonido on/off, movimiento reducido, cuenta (Google), exportar/importar datos, créditos y licencias |
| `#/onboarding` | Primera vez (≤ 3 pantallas) | Edad 13+ (confirmación), aviso de salud, lugar y zonas a cuidar. Se puede saltar y ofrece la carta de inmediato |

## 3. Mecánicas de juego

- **XP**: cada carta completada da XP según el nivel de la carta y la dificultad percibida.
- **Mazo del día**: meta diaria configurable (3 cartas por defecto). Se muestra con círculos o puntos, no con números grandes.
- **Racha**: días consecutivos con al menos una carta. Incluye un **comodín de racha** (1 por semana) para no castigar los días malos.
- **Niveles 1–10**: un nivel global y un nivel por grupo muscular. La app propone subir o bajar de nivel según el desempeño; el usuario puede fijarlo a mano (ver `02` §5).
- **Balance**: el motor reparte grupos musculares para cubrir el cuerpo completo en la semana.
- **Insignias y logros**: se desbloquean por hitos (ver §4). Al desbloquear hay animación, sonido y opción de compartir.
- **Compartir**: genera una imagen PNG pixel-art del logro (Canvas) y usa la Web Share API (o la descarga como alternativa). No incluye datos sensibles.

## 4. Insignias y logros (lista inicial; storyteller pone los nombres finales)

| ID | Disparador | Nombre provisional |
|----|------------|--------------------|
| `first-card` | Primera carta completada | Primer Snap |
| `daily-goal-1` | Primera meta diaria cumplida | Mazo Completo |
| `streak-3` / `streak-7` / `streak-30` | Racha de 3, 7 o 30 días | Racha de Bronce, Plata y Oro |
| `cards-50` / `cards-250` / `cards-1000` | Total de cartas | Coleccionista I, II y III |
| `full-body-week` | Todos los grupos en 7 días | Cuerpo Completo |
| `level-up-<group>` | Subir de nivel en un grupo | Subida: <Grupo> |
| `level-5` / `level-10` | Nivel global 5 o 10 | Jefe de Nivel, Leyenda Pixel |
| `early-bird` / `night-owl` | Carta antes de las 8:00 o después de las 21:00 | Gallo Madrugador, Búho Arcade |
| `park-explorer` | 10 cartas con lugar = parque | Explorador del Parque |
| `comeback` | Volver tras 7 días o más sin actividad | El Regreso |

Los IDs son contratos estables. Los visuales son de disenador y director-creativo, y el texto final de storyteller.

## 5. Temas (6, elegibles en Menú)

Se implementan solo con tokens CSS (`[data-theme="…"]`). Las paletas definitivas con contraste **WCAG AA** las define disenador; los hex de abajo son referencias iniciales.

| ID token | Base | Nombre creativo propuesto | Idea |
|----------|------|---------------------------|------|
| `medianoche` | Oscuro | **Medianoche 8-bit** | Arcade de noche, neón suave sobre azul tinta (`#0f1020`) |
| `manana` | Claro | **Mañana Pixel** | Papel crema y tinta, como un Game Boy al sol (`#f4f1e8`) |
| `chicle` | Rosa | **Chicle Turbo** | Rosa chicle y magenta, energía pop (`#ff6fae`) |
| `selva` | Verde | **Selva Guerrera** | Verdes de la sierra de Guerrero (`#2f9e55`) |
| `pacifico` | Azul | **Ola Pacífico** | Azules del mar de La Unión (`#2a7fd4`) |
| `volcan` | Rojo | **Volcán Power** | Rojo lava y naranja brasa (`#e0402f`) |

El tema por defecto sigue `prefers-color-scheme` (Medianoche u Mañana). Se respeta `prefers-reduced-motion`, que reduce las animaciones a un solo frame más un fade.

## 6. Sonido

Usa SFX chiptune breves: `listo`, `otra-carta`, `logro`, `subir-nivel` y un loop opcional (de melody). El sonido viene apagado por defecto en la oficina o el aula; la preferencia queda en Menú.

## 7. Accesibilidad

Contraste AA en los 6 temas, foco visible, `aria-live` para la recompensa, texto alternativo de cada sprite (el nombre del movimiento) y tamaño de fuente escalable (la fuente pixel solo se usa en títulos; el cuerpo usa una fuente legible).
