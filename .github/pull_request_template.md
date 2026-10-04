## Qué cambia

<!-- 1–3 frases. -->

## Workstream y tarjeta

- Workstream: <!-- story-copy | ui-tokens | card-frame | screens | assets | training | core -->
- Rama: `<workstream>/<modelo>-<tema>`
- Kanban: t_…
- Modelo / agente:

## Checklist

- [ ] Solo toqué archivos de mi workstream (docs/PARALLEL-WORK.md §1), o explico abajo por qué no.
- [ ] `npm run verify` pasa en local (tests, contenido, procedencia, build).
- [ ] Textos visibles nuevos están en `content/copy/es.json` o `content/story/<id>.json` (no en el código).
- [ ] Si cambié UI o textos: capturas 390×844 antes/después (`npm run screens`) adjuntas o en el artefacto de CI.
- [ ] Si es un cambio visual grande: QA con modelo multimodal (resumen abajo).
- [ ] Cada asset nuevo tiene su fila en `docs/ASSETS-PROVENANCE.md` (autor, modelo/herramienta, prompt, fecha, licencia).
- [ ] Costo: solo cuota de Grok Bot o herramientas gratis. Nada de pago sin OK de Brooks.
- [ ] No cambié `content/story/active.json`, IDs estables ni `src/core/**` (salvo workstream core).

## Capturas

<!-- Antes | Después -->

## QA multimodal / notas

