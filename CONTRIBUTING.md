# Contribuir a SnapFit

1. Lee `AGENTS.md` y `docs/00` … `docs/07`.
2. Un solo owner de código: **Codelius**. Los slices mecánicos van por Kanban a **`runica`** (desde el 2026-10-04, con DoD claro). Los especialistas entregan artefactos y no abren forks del producto.
3. Prohibido hacer force-push a `main`. No subas secretos.
4. Desde F1: `npm run test` y `npm run build` deben pasar antes de pedir review.
5. Handoffs de Grok a NexIA: título `[Grok:Codelius] …`, assignee `nexia`.

## Regla de procedencia de assets (obligatoria)

Todo archivo de imagen, sprite, ícono, fuente, sonido o música que entre al repo **debe** tener una fila en [`docs/ASSETS-PROVENANCE.md`](docs/ASSETS-PROVENANCE.md) **en el mismo commit**, con estos datos:

- ruta del archivo, autor (persona o agente), herramienta y modelo, prompt o método, fecha y licencia (CC BY 4.0 por defecto para assets propios).

Un PR o commit que agregue assets sin su fila **se rechaza**. Desde F1 habrá un check en CI que compare `public/assets/**` contra la tabla.

**Coste:** no se paga ningún asset, API ni herramienta sin la aprobación explícita de Brooks. Solo se usan la cuota de Grok Bot y Xiaomi MiMo, o herramientas libres (Aseprite compilado desde el código fuente, LibreSprite, jsfxr, etc.).

## Regla de contenido de entrenamiento

- Las cartas (`content/**.json`) siguen el schema de `docs/03-CONTENT.md`.
- Cada carta cita al menos una fuente en `sources` (estudio revisado por pares, guía oficial como OMS/ACSM o técnica documentada de dominio público).
- Entrenador valida la dosis, el nivel y las contraindicaciones. Codelius no inventa ejercicios.

## Licencias de lo que aportas

Al contribuir aceptas que tu código se publique bajo **MIT** y tu contenido o tus assets bajo **CC BY 4.0** (ver `LICENSE-ASSETS.md`).
