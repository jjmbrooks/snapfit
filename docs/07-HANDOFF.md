# 07: Handoff (cómo retomar o trabajar en paralelo)

## Arranque en frío

1. `git clone https://github.com/jjmbrooks/snapfit.git`
2. Lee `AGENTS.md` → `docs/00` … `docs/06` → este archivo.
3. `git log -5 --oneline` y `05-ROADMAP.md` para ver la fase abierta.
4. No le vuelvas a pedir el brief a Brooks: está en `docs/`.
5. Revisa el estado de las tarjetas Kanban (tabla abajo) antes de integrar entregables.

## Contratos estables (no se rompen sin migración)

| Contrato | Dónde | Regla |
|----------|-------|-------|
| IDs de cartas, mazos e insignias | `03-CONTENT.md`, `01-PRODUCT.md` §4 | No se renombran sin migrar eventos |
| Enums: grupos, lugares, zonas, equipo | `03-CONTENT.md` | Solo se agregan valores, no se renombran |
| Tipos de evento + `v` | `02-ARCHITECTURE.md` §3 | Si cambia el shape, se sube `v` y se escribe un migrador |
| IndexedDB `snapfit`, prefijo LS `snapfit.` | `02` §3 | Obligatorio |
| Schema de Firestore + reglas | `02` §4 | Se cambian solo con test del emulador |
| IDs de tema | `01-PRODUCT.md` §5 | `medianoche, manana, chicle, selva, pacifico, volcan` |
| `base` de Vite | `vite.config.js` | `/snapfit/` |

## Ownership de carpetas

| Carpeta | Dueño | Nota |
|---------|-------|------|
| `docs/` (excepto `training/`) | Codelius | Se cambia con OK de NexIA o Brooks si toca contratos |
| `docs/training/` | Entrenador (Codelius lo commitea) | No se edita la dosis sin Entrenador |
| `content/` | Codelius (transcribe a Entrenador) | Se valida con el schema |
| `src/core/` | Codelius | JS puro; un PR por módulo |
| `src/adapters/`, `src/ui/` | Codelius; Runica en slices | No se mezcla lógica en la UI |
| `public/assets/` | director-creativo / melody → Codelius | Siempre con su fila de procedencia |
| `.github/workflows/` | Codelius / Inge | |

## Checklist de sesión

- [ ] ¿Leí la fase abierta?
- [ ] ¿Toco un contrato? → migración y docs
- [ ] ¿Agrego un asset? → fila en `ASSETS-PROVENANCE.md`
- [ ] ¿Agrego una dependencia? → ADR en `02` §10
- [ ] Al terminar: commits con prefijo de fase, fila en la bitácora de consumo y reporte

## Pendientes de Brooks

- Crear el proyecto Firebase (Spark), activar Google Sign-In, autorizar el dominio `jjmbrooks.github.io` y pegar el `firebaseConfig`.
- (Opcional) Llenar las cifras de cuota en la bitácora de consumo.

## Kanban (board `nexia`)

_Se completa abajo con los IDs reales._

## Contacto

- GitHub: https://github.com/jjmbrooks/snapfit
- Owner: **jjmbrooks** (Jhonatan Jesús Martínez Brooks)
