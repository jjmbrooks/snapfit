# SnapFit — registro de producto

<!-- impeccable:product-schema 1 -->

> Escrito con el flujo `init` de Impeccable 4.6.0. La entrevista de Impeccable se hace con preguntas al
> usuario, y Codelius no tuvo un canal para hacerlas en esta sesión. Los hechos marcados **(inferido)** salen del
> encargo de Brooks y de la documentación del repo (docs/00-VISION.md, 01-PRODUCT.md). Brooks debe
> confirmarlos o corregirlos. El resto ya está confirmado en el repo.

## Platform

web

## Users

- Adolescentes desde 13 años y adultos hispanohablantes que quieren moverse un poco cada día sin ir al gimnasio
  (confirmado: docs/00-VISION.md, validación de edad ≥ 13 en el onboarding).
- Casi siempre en el teléfono, con una mano, en pausas cortas: en casa, en la escuela o en el trabajo
  **(inferido de «mobile-first» y de las cartas de ≤ 120 s)**.
- Nivel de condición física variado, desde sedentario. Por eso todas las cartas actuales son de nivel 1–2 y
  usan apoyo (silla, pared o mesa).

## Product Purpose

Convertir micro‑ejercicios seguros en un juego de cartas. Cada día el mazo reparte cartas. Cada carta es un
gesto de ≤ 2 minutos. Al completarla se gana XP y se sube de nivel por escuela (grupo muscular). El éxito es
la constancia: completar las cartas del día y mantener la racha, no la intensidad.

## Positioning

Un mazo de cartas coleccionables con estética de **grimorio arcade** y una historia intercambiable
(paquete «Vitalia» por defecto). La mecánica de progreso (core) está separada de la narrativa (paquetes de
historia, ADR-011), así que la misma rutina se puede vestir con otra historia sin tocar el progreso.

## Operating Context

- PWA estática en GitHub Pages (`/snapfit/`). Funciona sin conexión después del primer inicio de sesión con Google.
- Flujo de primer uso: bienvenida (historia) → Google → perfil (edad, sexo, condición, prueba rápida) → mazo
  asignado → aviso de salud → jugar.
- Uso diario: carta frente (qué es) → voltear (cómo se hace, 3 pasos con pose) → ¡Listo! u Otro →
  recompensa → progreso y logros.

## Capabilities and Constraints

- Vite + JS sin framework, enrutador por hash, Firebase Auth/Firestore y Analytics opcional con una lista
  cerrada de eventos.
- Las cartas son contenido (`content/cards/*.json`, CC‑BY‑4.0) y todas siguen siendo **borradores** pendientes
  del Entrenador.
- Viewport soportado: 360–430 px de ancho. En escritorio la app se ve centrada a 520 px como máximo.
- Gasto cero: sin servicios de pago (regla de Brooks).
- Pendiente de decidir: nombre de la región 10, visibilidad del selector de historias y protección de rama.

## Brand Commitments

- Nombre «SnapFit». Reino «Vitalia» (nombre elegido por Brooks). Guía: Pip.
- Estilo de carta C «grimorio arcade», elegido por Brooks el 2026-10-03: marco de escuela, gema de rango
  bronce/plata/oro/gema, pergamino, madera y brillo verde. Referencias: `docs/proposals/ui/cartas-vitalia/`.
- Tipografías: Press Start 2P (marca y HUD) y Georgia o similar (títulos de carta y grimorio).
- Voz en español neutro, cercana, que tutea y no culpa.

## Evidence on Hand

- Ilustración de frente provisional y 3 poses finales solo para `sentadilla-silla-l1`
  (`public/art/vitalia/`). Las otras 11 cartas no tienen arte final: no hay que inventarlo. La lista está en
  `/workspace/snapfit-propuestas/vitalia/arte-pendiente.json`.
- Videos tutoriales verificados para 10 de 12 cartas (docs/training/VIDEOS.md).
- No hay testimonios, métricas de uso ni revisión profesional del contenido todavía. No hay que fabricarlos.

## Product Principles

1. **Seguridad antes que intensidad.** Cada carta muestra sus zonas de cuidado y sus contraindicaciones, con
   enlace a la ficha y sus fuentes.
2. **Un gesto, una carta.** Cada carta se entiende en 5 segundos y se termina en menos de 2 minutos.
3. **La historia viste, el progreso manda.** La narrativa nunca bloquea ni condiciona la mecánica, y todo
   texto de historia tiene un equivalente neutro (grupo muscular visible).
4. **Funciona sin red y sin rastreo.** La app es offline‑first y solo envía estadísticas mínimas y opcionales.
   Los clics no se rastrean.

## Accessibility & Inclusion

- WCAG 2.2 AA: contraste ≥ 4.5:1 (lo verifica tests/ui/contrast.test.js), objetivos táctiles de 48 px en
  los controles de la app (≥ 24 px dentro de la carta) y foco visible.
- `prefers-reduced-motion` y el ajuste propio «Reducir animaciones».
- Texto de 11 px como mínimo. Lenguaje claro para personas desde 13 años **(inferido)**.
