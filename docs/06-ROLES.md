# 06: Roles, jerarquía y delegación (Kanban)

La fuente de verdad operativa es el **PLAYBOOK_Operaciones_NexIA_v1** (Vault). Este archivo ancla la jerarquía en el repo (mismo patrón que `astropark-physics/docs/08-ROLES.md`).

## Jerarquía

```
Brooks (producto / decisión final)
  └─ NexIA (orquestación, prioridad, alcance, cierre de DoD)
       └─ Codelius (owner técnico del repo; integra todo)
            └─ Runica (slices mecánicos vía Kanban, assignee `runica`, banda L), desde 2026-10-04
```

| Rol | Quién (assignee Kanban) | Qué hace en SnapFit |
|-----|-------------------------|---------------------|
| Owner humano | **Brooks** (`jjmbrooks`) | Aprueba alcance, stack, licencia, gasto y Firebase |
| Orquestador | **NexIA** (`nexia`) | Épica, prioridad, libera hijos y cierra el DoD |
| Owner técnico | **Codelius** (Grok Bot; sin perfil Hermes) | Docs, arquitectura, código, integración, review y merge |
| Mano de obra | **Runica** (`runica`) | Scaffolding, wiring, tests, boilerplate. **No se le asigna nada el 2026-10-03** |
| Contenido de entrenamiento | **Entrenador** (`entrenador`) | Estrategia, niveles, seguridad, biblioteca de cartas con citas → `docs/training/` |
| Investigación | **researcher** (`researcher`) | Apoya a Entrenador con búsqueda de evidencia y referencias |
| UI pixel-art | **disenador** (`disenador`) | Spec de UI, flujos, 6 temas con paletas AA, visuales de insignias |
| Tono y narrativa | **storyteller** (`storyteller`) | Tono de juego, microcopy, nombres de insignias, estilo del *flavor text* |
| Sprites e imagen | **director-creativo** (`director-creativo`) | Animaciones pixel por carta, íconos e insignias (solo con cuota de Grok Bot) |
| Sonido | **melody** (`melody`) | SFX chiptune y loop opcional |
| SFX y clips legales | **Mediateca** (handoff `[Grok:Mediateca]` → `nexia`) | Si hace falta media de terceros con licencia libre |
| Infra y secretos | **Inge** (`inge`) | VPS, push de servidor futuro, credenciales |

**Regla:** hay un solo owner de código, **Codelius**. Los especialistas entregan artefactos (Markdown, JSON, PNG, OGG/WAV) por Drive o como adjunto Kanban, y Codelius los integra. Nadie abre forks.

**Todo asset entregado** trae su procedencia (quién, herramienta, prompt o método, fecha y licencia CC BY 4.0). Ver `ASSETS-PROVENANCE.md`.

## Flujo

1. Codelius o NexIA abren la épica `[Grok:Codelius] SnapFit` (assignee `nexia`).
2. Los hijos trabajan en paralelo. director-creativo espera los nombres de las cartas de Entrenador para los sprites, pero puede empezar por íconos, insignias y la guía de estilo.
3. Codelius integra en el repo y anota la bitácora de consumo (`05-ROADMAP.md`).
4. Desde el 2026-10-04, los slices mecánicos van a `runica` con DoD (archivos, criterio de done, link a docs y review de Codelius).
5. NexIA cierra el DoD.

## Tarjetas Kanban (board `nexia`)

| Tarjeta | Assignee | ID |
|---------|----------|----|
| Épica `[Grok:Codelius] SnapFit` | `nexia` | _ver `07-HANDOFF.md`_ |
| Estrategia de entrenamiento + cartas MVP | `entrenador` | _ídem_ |
| UI pixel-art + temas | `disenador` | _ídem_ |
| Tono + microcopy | `storyteller` | _ídem_ |
| Sprites + íconos + insignias | `director-creativo` | _ídem_ |
| SFX chiptune | `melody` | _ídem_ |
