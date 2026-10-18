# Escalera de cartas 1–10 (adulto-general)

Estado al 2026-10-17. Vista por grupo muscular de qué cartas hay en cada nivel y en qué estado están. La fuente de verdad es el contenido (`content/cards/` publicado, `content/drafts/` borradores); esta tabla es un resumen.

**Rangos** (`tierOf` en `src/ui/card/card-data.js`): Aprendiz 1–3 · Adepto 4–6 · Magister 7–9 · Archimago 10.

**Leyenda:** ✅ publicada en el mazo · 📝 borrador validado por Entrenador el 2026-10-03 (Entrega 1, `t_78a921ff`), falta integrarla · 🧪 propuesta de Codelius (2026-10-17) sin validar · — sin carta.

Los borradores (📝 y 🧪) viven en la rama `content/codelius-escalera-borrador` (`content/drafts/escalera-l2-l6.json`, `published: false`) y **no entran al mazo** hasta que Entrenador los valide con fuente y video (tarjeta Kanban de validación enlazada a `t_78a921ff`).

## Límite temporal de nivel

Mientras la escalera esté incompleta, el nivel de cada grupo no puede pasar de **nivel de la carta publicada más alta del grupo + 1** (`levelCaps` en `src/core/leveling.js`, aplicado en `src/ui/app.js`). Así nadie sube a un nivel sin cartas y se queda repitiendo las fáciles. El tope también recorta el nivel inicial de la prueba rápida y los niveles fijados a mano. En la pantalla de progreso, un grupo en el tope muestra «Nv N pronto». Cuando se publiquen cartas de un nivel mayor, el tope sube solo; no hay que tocar código.

| Grupo | Carta publicada más alta | Tope actual |
|---|---|---|
| Piernas | Nv 2 | **Nv 3** |
| Glúteos | Nv 1 | **Nv 2** |
| Empuje | Nv 2 | **Nv 3** |
| Tracción | Nv 1 | **Nv 2** |
| Core | Nv 1 | **Nv 2** |
| Movilidad | Nv 1 | **Nv 2** |
| Cardio | Nv 1 | **Nv 2** |

## Tabla por grupo y nivel

| Grupo | Nv 1 (Aprendiz) | Nv 2 (Aprendiz) | Nv 3 (Aprendiz) | Nv 4 (Adepto) | Nv 5 (Adepto) | Nv 6 (Adepto) | Nv 7–10 (Magister/Archimago) |
|---|---|---|---|---|---|---|---|
| Piernas | ✅ Sentadilla a la silla<br>✅ Elevación de talones | ✅ Zancada atrás con apoyo<br>📝 Sentadilla libre | 📝 Sentadilla split<br>📝 Zancada trasera | 🧪 Zancada frontal alterna | 🧪 Sentadilla búlgara | 🧪 Sentadilla a una pierna a la silla | idea: pistol con asiento bajo → pistol completa |
| Glúteos | ✅ Puente de glúteo | 📝 Abducción de cadera de pie<br>📝 Puente de glúteo con pausa | 📝 Puente de glúteo a una pierna | 🧪 Puente con hombros elevados | 🧪 Puente a una pierna con hombros elevados | 🧪 Peso muerto a una pierna | idea: peso muerto 1 pierna con pausa → hip thrust 1 pierna con tempo |
| Empuje | ✅ Flexión en la pared | ✅ Flexión inclinada en mesa firme<br>📝 Flexión de rodillas | 📝 Flexión completa<br>📝 Flexión diamante<br>📝 Flexión pica | 🧪 Flexión completa lenta | 🧪 Flexión declinada | 🧪 Flexión pica con pies elevados | idea: flexión arquero → flexión a una mano asistida |
| Tracción | ✅ Remo isométrico con toalla | 📝 Remo invertido en banca<br>📝 Remo invertido bajo la mesa | 📝 Dominada negativa<br>📝 Remo invertido con pies elevados | 🧪 Remo invertido con pausa | 🧪 Dominada isométrica arriba | 🧪 Dominada negativa lenta | idea: dominada completa → dominada arquero asistida |
| Core | ✅ Perro-pájaro<br>✅ Plancha con rodillas | 📝 Plancha frontal<br>📝 Plancha lateral en rodillas | 📝 Elevación de piernas acostado<br>📝 Plancha lateral | 🧪 Plancha con toque de hombro | 🧪 Hollow agrupado | 🧪 Hollow extendido | idea: hollow con balanceo → L-sit en banca |
| Movilidad | ✅ Círculos de brazos | 📝 Apertura de hombros con toalla<br>📝 Estiramiento de flexores de cadera | 📝 Estiramiento de flexores de cadera de pie | 🧪 Sentadilla profunda sostenida | 🧪 Estiramiento mundial | 🧪 Sentadilla cosaca asistida | idea: cosaca profunda → puente de espalda (rueda) |
| Cardio | ✅ Marcha en el sitio<br>✅ Saltos de tijera sin salto | 📝 Escalador lento<br>📝 Salto tijera<br>📝 Subida de escalón | 📝 Sentadilla con salto | 🧪 Escalador | 🧪 Patinador | 🧪 Burpee | idea: burpee con flexión → EMOM de 10 min |

## Detalle de los borradores (niveles 2–6)

| id | Nombre | Nv | Rango | Grupo | Dosis | Estado |
|---|---|---|---|---|---|---|
| `sentadilla-libre-l2` | Sentadilla libre | 2 | Aprendiz | Piernas | 12 reps | 📝 Entrenador 2026-10-03 |
| `sentadilla-split-l3` | Sentadilla split | 3 | Aprendiz | Piernas | 10 reps/lado | 📝 Entrenador 2026-10-03 |
| `zancada-trasera-l3` | Zancada trasera | 3 | Aprendiz | Piernas | 8 reps/lado | 📝 Entrenador 2026-10-03 |
| `zancada-alterna-l4` | Zancada frontal alterna | 4 | Adepto | Piernas | 2×6 reps/lado | 🧪 Codelius, sin validar |
| `sentadilla-bulgara-l5` | Sentadilla búlgara | 5 | Adepto | Piernas | 2×6 reps/lado | 🧪 Codelius, sin validar |
| `sentadilla-pistol-silla-l6` | Sentadilla a una pierna a la silla | 6 | Adepto | Piernas | 2×5 reps/lado | 🧪 Codelius, sin validar |
| `abduccion-cadera-pie-l2` | Abducción de cadera de pie | 2 | Aprendiz | Glúteos | 12 reps/lado | 📝 Entrenador 2026-10-03 |
| `puente-gluteo-l2` | Puente de glúteo con pausa | 2 | Aprendiz | Glúteos | 15 reps | 📝 Entrenador 2026-10-03 |
| `puente-gluteo-una-pierna-l3` | Puente de glúteo a una pierna | 3 | Aprendiz | Glúteos | 8 reps/lado | 📝 Entrenador 2026-10-03 |
| `puente-hombros-elevados-l4` | Puente con hombros elevados | 4 | Adepto | Glúteos | 2×12 reps | 🧪 Codelius, sin validar |
| `puente-una-pierna-elevado-l5` | Puente a una pierna con hombros elevados | 5 | Adepto | Glúteos | 2×6 reps/lado | 🧪 Codelius, sin validar |
| `peso-muerto-una-pierna-l6` | Peso muerto a una pierna | 6 | Adepto | Glúteos | 2×5 reps/lado | 🧪 Codelius, sin validar |
| `flexion-rodillas-l2` | Flexión de rodillas | 2 | Aprendiz | Empuje | 8 reps | 📝 Entrenador 2026-10-03 |
| `flexion-completa-l3` | Flexión completa | 3 | Aprendiz | Empuje | 2×8 reps | 📝 Entrenador 2026-10-03 |
| `flexion-diamante-l3` | Flexión diamante | 3 | Aprendiz | Empuje | 2×6 reps | 📝 Entrenador 2026-10-03 |
| `flexion-pike-l3` | Flexión pica | 3 | Aprendiz | Empuje | 2×6 reps | 📝 Entrenador 2026-10-03 |
| `flexion-tempo-l4` | Flexión completa lenta | 4 | Adepto | Empuje | 2×8 reps | 🧪 Codelius, sin validar |
| `flexion-declinada-l5` | Flexión declinada | 5 | Adepto | Empuje | 2×8 reps | 🧪 Codelius, sin validar |
| `flexion-pike-elevada-l6` | Flexión pica con pies elevados | 6 | Adepto | Empuje | 2×6 reps | 🧪 Codelius, sin validar |
| `remo-banca-l2` | Remo invertido en banca | 2 | Aprendiz | Tracción | 8 reps | 📝 Entrenador 2026-10-03 |
| `remo-mesa-l2` | Remo invertido bajo la mesa | 2 | Aprendiz | Tracción | 8 reps | 📝 Entrenador 2026-10-03 |
| `dominada-negativa-l3` | Dominada negativa | 3 | Aprendiz | Tracción | 2×4 reps | 📝 Entrenador 2026-10-03 |
| `remo-mesa-alto-l3` | Remo invertido con pies elevados | 3 | Aprendiz | Tracción | 8 reps | 📝 Entrenador 2026-10-03 |
| `remo-mesa-pausa-l4` | Remo invertido con pausa | 4 | Adepto | Tracción | 2×8 reps | 🧪 Codelius, sin validar |
| `dominada-isometrica-l5` | Dominada isométrica arriba | 5 | Adepto | Tracción | 3×8 s | 🧪 Codelius, sin validar |
| `dominada-negativa-lenta-l6` | Dominada negativa lenta | 6 | Adepto | Tracción | 3×3 reps | 🧪 Codelius, sin validar |
| `plancha-frontal-l2` | Plancha frontal | 2 | Aprendiz | Core | 2×25 s | 📝 Entrenador 2026-10-03 |
| `plancha-lateral-rodillas-l2` | Plancha lateral en rodillas | 2 | Aprendiz | Core | 15 s/lado | 📝 Entrenador 2026-10-03 |
| `elevacion-piernas-l3` | Elevación de piernas acostado | 3 | Aprendiz | Core | 8 reps | 📝 Entrenador 2026-10-03 |
| `plancha-lateral-l3` | Plancha lateral | 3 | Aprendiz | Core | 20 s/lado | 📝 Entrenador 2026-10-03 |
| `plancha-toque-hombro-l4` | Plancha con toque de hombro | 4 | Adepto | Core | 2×6 reps/lado | 🧪 Codelius, sin validar |
| `hollow-agrupado-l5` | Hollow agrupado | 5 | Adepto | Core | 2×20 s | 🧪 Codelius, sin validar |
| `hollow-extendido-l6` | Hollow extendido | 6 | Adepto | Core | 2×25 s | 🧪 Codelius, sin validar |
| `apertura-hombros-toalla-l2` | Apertura de hombros con toalla | 2 | Aprendiz | Movilidad | 8 reps | 📝 Entrenador 2026-10-03 |
| `estiramiento-flexor-cadera-l2` | Estiramiento de flexores de cadera | 2 | Aprendiz | Movilidad | 20 s/lado | 📝 Entrenador 2026-10-03 |
| `estiramiento-flexor-cadera-pie-l3` | Estiramiento de flexores de cadera de pie | 3 | Aprendiz | Movilidad | 25 s/lado | 📝 Entrenador 2026-10-03 |
| `sentadilla-profunda-sostenida-l4` | Sentadilla profunda sostenida | 4 | Adepto | Movilidad | 2×30 s | 🧪 Codelius, sin validar |
| `estiramiento-mundial-l5` | Estiramiento mundial | 5 | Adepto | Movilidad | 4 reps/lado | 🧪 Codelius, sin validar |
| `sentadilla-cosaca-l6` | Sentadilla cosaca asistida | 6 | Adepto | Movilidad | 2×5 reps/lado | 🧪 Codelius, sin validar |
| `escalador-lento-l2` | Escalador lento | 2 | Aprendiz | Cardio | 30 s | 📝 Entrenador 2026-10-03 |
| `salto-tijera-l2` | Salto tijera | 2 | Aprendiz | Cardio | 30 s | 📝 Entrenador 2026-10-03 |
| `subida-escalon-l2` | Subida de escalón | 2 | Aprendiz | Cardio | 45 s | 📝 Entrenador 2026-10-03 |
| `sentadilla-salto-l3` | Sentadilla con salto | 3 | Aprendiz | Cardio | 8 reps | 📝 Entrenador 2026-10-03 |
| `escalador-l4` | Escalador | 4 | Adepto | Cardio | 2×20 s | 🧪 Codelius, sin validar |
| `patinador-l5` | Patinador | 5 | Adepto | Cardio | 2×20 s | 🧪 Codelius, sin validar |
| `burpee-l6` | Burpee | 6 | Adepto | Cardio | 2×6 reps | 🧪 Codelius, sin validar |

Total: 12 publicadas + 46 borradores (25 de Entrenador, 21 propuestas). Con todo validado, la escalera llega a 58 cartas hasta el nivel 6.

## Notas para la validación

- **Ids equivalentes:** la Entrega 1 usaba `zancada-apoyo-l2`, `flexion-inclinada-l2`, `bird-dog-l2`, `remo-toalla-l1`, `step-jack-l1` y `elevacion-talones-l1`; en el repo son `zancada-atras-apoyo-l2`, `flexion-mesa-l2`, `perro-pajaro-l1` (nivel 1 aquí, nivel 2 en la Entrega 1), `remo-toalla-iso-l1`, `step-jacks-l1` y `talones-l1`. Los borradores ya apuntan a los ids del repo y no se duplicaron esas cartas.
- **Cartas de nivel 1 de la Entrega 1 aún no integradas** (fuera de este alcance): `dead-bug-l1`, `abduccion-cadera-acostado-l1`, `sentadilla-muro-l1`, `gato-camello-l1`, `rotacion-toracica-l1`, `estiramiento-isquiotibiales-l1`.
- **Equipo:** las dominadas usan `banca-parque` porque el enum de `equipment` no tiene barra; se propone agregar `barra-parque`.
- **Pasos:** las propuestas traen 4 pasos (inicio, fase media, punto final, regreso) para las posturas; el reverso publicado hoy admite 3. Los borradores no se validan con ese tope hasta publicarse.
