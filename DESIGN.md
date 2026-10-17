---
name: SnapFit
description: Micro‑ejercicios como cartas de un grimorio arcade (paquete Vitalia).
colors:
  noche-tinta: "#0f1020"
  noche-superficie: "#1b1d3a"
  noche-borde: "#3a3f7a"
  texto-luna: "#f1f1ff"
  texto-bruma: "#b4b6e0"
  oro-moneda: "#ffd23f"
  cian-portal: "#5ce1e6"
  pergamino: "#f3e2bf"
  pergamino-2: "#e6cf9f"
  tinta-pergamino: "#3b2410"
  madera: "#2a1a10"
  madera-2: "#3d2716"
  ribete-bronce: "#c8803e"
  ribete-claro: "#f0c27a"
  brillo-hechizo: "#7dff6a"
  escuela-raiz: "#4cae4f"
  escuela-arco: "#f0883a"
  escuela-palma: "#e5524b"
  escuela-cuerda: "#4a90e2"
  escuela-sello: "#9d6fe3"
  escuela-nudo: "#22b3a6"
  escuela-latido: "#ec5f9e"
  rango-bronce: "#c8803e"
  rango-plata: "#b8c1ce"
  rango-oro: "#e8b931"
  rango-gema: "#b25cf0"
typography:
  display:
    fontFamily: "'Press Start 2P', ui-monospace, monospace"
    fontSize: "30px"
    lineHeight: 1.5
  headline:
    fontFamily: "'Press Start 2P', ui-monospace, monospace"
    fontSize: "16px"
    lineHeight: 1.5
  title:
    fontFamily: "Georgia, 'Palatino Linotype', serif"
    fontSize: "5.1cqi"
    fontWeight: 800
    lineHeight: 1.1
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', sans-serif"
    fontSize: "16px"
    lineHeight: 1.45
  label:
    fontFamily: "'Press Start 2P', ui-monospace, monospace"
    fontSize: "11px"
rounded:
  ui: "12px"
  panel: "14px"
  card: "4.5cqi"
  pill: "999px"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "24px"
  s6: "32px"
components:
  button-primary:
    backgroundColor: "{colors.oro-moneda}"
    textColor: "{colors.noche-tinta}"
    rounded: "{rounded.ui}"
    height: "48px"
  button-listo:
    textColor: "#fffbe6"
    rounded: "10px"
    height: "60px"
  button-otro:
    backgroundColor: "{colors.pergamino}"
    textColor: "{colors.tinta-pergamino}"
    rounded: "10px"
    height: "60px"
  card-step:
    backgroundColor: "{colors.pergamino}"
    textColor: "{colors.tinta-pergamino}"
  card-video-link:
    backgroundColor: "#120a04"
    textColor: "#bfefff"
    rounded: "{rounded.pill}"
    height: "24px"
---

# Design System: SnapFit · Grimorio arcade

## Overview

**Estrella polar: «El grimorio de bolsillo».** Cada ejercicio es un hechizo impreso en una carta física:
marco de la escuela, gema de rango, pergamino con las instrucciones y madera con ribete de bronce alrededor
del juego. La interfaz de la app (HUD, menús y formularios) es pixel‑art nocturno y sobrio para que la carta
sea siempre lo más vistoso. Lo que no queremos: dashboards de fitness genéricos, degradados morados de
«app de IA» y glassmorphism.

## Colors

Los 6 temas de la app (medianoche, mañana, chicle, selva, pacífico y volcán) están en `src/ui/styles/tokens.css §2`.
Los colores de escuela y de rango están fijos (§3–4) y no cambian con el tema.

### Primary
- **Oro moneda** (#ffd23f): acción principal y marca en el tema medianoche. El texto encima va en tinta oscura (#1b1300).

### Secondary
- **Cian portal** (#5ce1e6): enlaces, foco y acentos de estado.

### Neutral
- **Noche tinta / superficie / borde** (#0f1020, #1b1d3a, #3a3f7a): fondo en capas tonales, sin sombras difusas.
- **Pergamino** (#f3e2bf → #e6cf9f) con **tinta de pergamino** (#3b2410): superficies de lectura dentro de la carta.
- **Madera y ribete de bronce** (#2a1a10, #c8803e, #f0c27a): marco del juego (barra inferior, botones, dorso del mazo).

### Named Rules
- **Escuelas = grupo muscular.** Raíz/piernas verde, Arco/glúteos naranja, Palma/empuje rojo, Cuerda/tracción
  azul, Sello/core morado, Nudo/movilidad turquesa y Latido/cardio rosa. El morado de Sello es identidad de
  escuela, no un degradado decorativo.
- **Brillo de hechizo (#7dff6a)** solo en lo que está «vivo»: ¡Listo!, la barra de progreso y la pestaña
  activa. No va en marcos ni en ventanas.

## Typography

### Hierarchy
- **Display/headline (Press Start 2P):** logo (30 px), títulos de pantalla (16 px), HUD y etiquetas (11 px como mínimo).
- **Título de carta (Georgia, versalitas, 800):** se escala con la carta (`cqi`) y se limita a 2 líneas.
- **Body (system‑ui 16 px / 1.45):** todo el texto de lectura de la app.
- **Piso de 11 px** (`--text-floor`): todo texto escalado con `cqi` usa `max(var(--text-floor), Ncqi)`.

## Layout

- Diseño para teléfonos de 360–430 px: una columna y `--maxw: 520px` en pantallas grandes.
- La app es una cuadrícula de 3 filas (cabecera, contenido con scroll, barra inferior) que nunca se solapan, con márgenes seguros `env(safe-area-inset-*)`.
- La carta mantiene una proporción 5:7 y llena el alto disponible. Su contenido se escala con container queries (`cqi`).

## Elevation & Depth

Profundidad «de juego de mesa»: sombras duras desplazadas hacia abajo (`0 4px 0`) y ribetes con `inset`. No
hay sombras difusas de tarjeta SaaS. Los brillos solo aparecen en elementos vivos (ver arriba).

## Shapes

Radios de 12 px en botones y campos, 14 px en paneles y 4.5 cqi en la carta, y píldoras para chips y enlaces
pequeños. Los números de paso usan un banderín recortado (clip‑path) y la gema de rango es un rombo.

## Components

- **Carta arcade** (`src/ui/components/tcard.js`, `src/ui/card/*.css`): frente (gema, estandarte, emblema,
  ventana, pergamino y escudo de XP) y reverso (estandarte, 3 pasos con pose, tira dosis + respiración,
  enlace «Ver video · fuente», cuidados y ficha).
- **Enlace de video:** píldora oscura con icono de reproducción, de 24 px de alto como mínimo. Se abre en una
  pestaña nueva, sin incrustar y sin rastreo.
- **Botones ¡Listo! / Otro** (`grimorio.css`): ¡Listo! en verde hechizo con gemas en el ribete y Otro en pergamino.
- **Aviso** (`.notice`): borde completo en tono de advertencia. Nunca una franja lateral gruesa.

## Do's and Don'ts

- **Sí:** el texto neutro (grupo muscular) siempre visible junto al texto de historia.
- **Sí:** animaciones con `--ease-out` (sin rebote) que respetan «reducir movimiento» (del sistema y del ajuste propio).
- **Sí:** el arte va en `public/art/<paquete>/…`, y cada archivo lleva una fila en docs/ASSETS-PROVENANCE.md.
- **No:** texto con degradado, emojis como sistema de iconos en elementos nuevos (los heredados del menú están
  documentados como deuda), franjas laterales gruesas, glass, rebote o elástico, ni texto de menos de 11 px.
- **No:** incrustar videos, reproducir automáticamente ni medir clics en enlaces externos.
