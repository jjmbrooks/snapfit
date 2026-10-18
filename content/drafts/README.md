# content/drafts/

Cartas **en borrador, sin publicar** (`draft: true`, `published: false`). La app no importa esta carpeta y
`levelCaps` ignora `published: false`, así que no entran al mazo ni suben el límite de nivel.

- `escalera-l2-l6.json`: escalera Aprendiz (Nv 2–3) y Adepto (Nv 4–6), 46 cartas.
  - `origin: entrenador-entrega-1-2026-10-03`: validadas por Entrenador en `t_78a921ff` (con `sources`), nunca integradas.
  - `origin: codelius-propuesta-2026-10-17`: propuestas sin validar (`sources: []`, `reviewedBy: null`).
  - Campos extra del borrador: `status`, `origin`, `draftNote`, `progression` (criterio para pasar a la siguiente), `tier`.
- Lo valida `npm run check:content` (3–5 pasos; texto largo y falta de fuentes son avisos, no errores).
- Se regenera con `python3 scripts/drafts/build_escalera.py content/drafts/escalera-l2-l6.json` (lee `docs/training/cards-mvp.json`, Entrega 1 de Entrenador); la tabla está en `docs/ESCALERA.md`.

**Para publicar una carta:** Entrenador la valida (dosis, pasos, contraindicaciones, fuente con DOI/URL y video
público verificado), se mueve a `content/cards/`, se quita `published: false`/`draft`, se ajusta a `MAX_STEPS`,
se agrega al mazo en `content/decks/` y se crea su arte con procedencia. El límite de nivel sube solo.
