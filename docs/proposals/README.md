# Propuestas en competencia

Aquí van propuestas alternativas de **historia**, **copy** y **UI** para que Brooks compare y elija. Ver `docs/PARALLEL-WORK.md`.

```
docs/proposals/
  story/<modelo>.md        # ficha de la historia + paquete content/stories/<id>/ en el mismo PR
  story/<id>/*.png         # capturas 390×844 con ?story=<id>
  copy/<modelo>.md         # cambios de microcopy propuestos (tabla clave → texto)
  ui/<modelo>.md           # tema / marco de carta / pantallas: descripción + capturas
  ui/<modelo>/*.png
```

## Plantilla de ficha

```markdown
# <Título de la propuesta>
- Modelo / agente: …        - Fecha: AAAA-MM-DD        - Tarjeta Kanban: t_…
- Herramientas y costo: (solo cuota de Grok Bot o gratis)
## Idea en una línea
## Por qué encaja con SnapFit (público, tono, mecánica Listo/Otro/volteo)
## Contenido (o enlace al JSON / CSS)
## Capturas 390×844
## QA multimodal (qué modelo, qué observó)
## Riesgos / dudas
```

No cambies `content/stories/index.json` (paquete por defecto) ni el tema por defecto: eso se decide con Brooks.
