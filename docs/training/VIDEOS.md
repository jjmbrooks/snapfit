# Videos tutoriales en el reverso de las cartas

Cada carta de ejercicio puede llevar **un** enlace a un video tutorial público. El dato vive en el contenido
(`content/cards/*.json`, campos `videoUrl` + `videoSource`), no en el código. El reverso de la carta muestra un
enlace pequeño con icono de reproducción y la etiqueta «Ver video · {fuente}».

## Reglas

- **Fuente fiable:** canal de una institución sanitaria o deportiva reconocida, o de un profesional
  certificado (fisioterapeuta, entrenador con certificación acreditada). Se prefiere español a igual calidad.
- **Verificación:** cada URL se comprobó con el endpoint público oEmbed de YouTube
  (`https://www.youtube.com/oembed?url=<URL>&format=json`); el título y el canal devueltos deben coincidir
  con el ejercicio de la carta. Fecha de verificación: 2026-10-17.
- **Formato:** solo `https://www.youtube.com/watch?v=<id>` o `https://youtu.be/<id>`; `videoSource` es
  obligatorio cuando hay `videoUrl` (máx. 28 caracteres). Lo valida `npm run check:content`.
- **Sin incrustar ni autoplay:** es un enlace normal (`target="_blank" rel="noopener noreferrer"`). En
  teléfonos, un enlace a youtube.com suele abrir la app de YouTube.
- **Sin video verificado = nada:** si la carta no tiene `videoUrl`, el reverso no muestra el enlace.
- **Privacidad:** SnapFit **no registra** los clics en estos enlaces (ni Firebase Analytics ni ningún otro
  evento). Al abrir el video, la persona sale a YouTube y aplica la política de privacidad de Google/YouTube.
  Ver docs/PRIVACY.md.
- El video **no sustituye** la ficha de la carta ni la revisión del Entrenador: si el video y la carta
  difieren en dosis o variante, manda la carta.

## Lista (mazo «adulto-general», 12 cartas)

| Carta | Ejercicio | URL | Canal (título oEmbed) | Idioma | Por qué es fiable |
|---|---|---|---|---|---|
| sentadilla-silla-l1 | Sentadilla a silla | https://www.youtube.com/watch?v=u6hh6vOgXNI | FREMAP Mutua Colaboradora con la S. S. nº 61 — «FISIOTERAPIA EN CASA: Sentadilla con silla» | es | Mutua colaboradora de la Seguridad Social de España; serie de fisioterapia de sus servicios sanitarios. |
| flexion-pared-l1 | Flexión en pared | https://www.youtube.com/watch?v=751E9kAdkwg | National Institute on Aging — «Wall Pushups Strength Exercise for Older Adults» | en | Instituto Nacional sobre el Envejecimiento (NIH, gobierno de EE. UU.). |
| puente-gluteo-l1 | Puente de glúteo | https://www.youtube.com/watch?v=VveNLI1KIcQ | FREMAP Mutua Colaboradora con la S. S. nº 61 — «FISIOTERAPIA EN CASA: El puente» | es | Igual que arriba (FREMAP). Alternativa en inglés: NHS «Pilates for back pain: The Bridge» (ExFzjIRtDho). |
| marcha-sitio-l1 | Marcha en el sitio | https://www.youtube.com/watch?v=xom-st-GwW4 | MU Health — «Standing March» | en | MU Health Care, sistema hospitalario académico de la Universidad de Missouri. |
| talones-l1 | Elevación de talones | https://www.youtube.com/watch?v=4rgR6KtyHzI | NHS inform — «Standing double heel raises» | en | Servicio nacional de información sanitaria del NHS de Escocia. |
| remo-toalla-iso-l1 | Remo isométrico con toalla | — | — | — | Sin video: no se encontró un canal institucional o profesional certificado con este ejercicio exacto. |
| perro-pajaro-l1 | Perro-pájaro | https://www.youtube.com/watch?v=ZdAHe9_HeEw | National Academy of Sports Medicine (NASM) — «How to do a Bird Dog \| Proper Form & Technique \| NASM» | en | NASM, certificadora de entrenadores personales acreditada (NCCA). |
| plancha-rodillas-l1 | Plancha con rodillas | https://www.youtube.com/watch?v=idNd2kjXotw | Madrid Deporte — «Plancha anterior con apoyo en rodillas» | es | Canal de deporte municipal de Madrid (programas de actividad física del Ayuntamiento). |
| circulos-brazos-l1 | Círculos de brazos | https://www.youtube.com/watch?v=4olV-GiwxQs | NHS inform — «Arm circles» | en | NHS de Escocia. |
| step-jacks-l1 | Saltos de tijera sin salto | — | — | — | Sin video: solo aparecieron canales de entrenadores sin acreditación verificable (o variantes con salto). |
| zancada-atras-apoyo-l2 | Zancada atrás con apoyo | https://www.youtube.com/watch?v=azx15iak_X0 | PartnerMD — «How to Do a Reverse Lunge with Chair Support \| Exercise with PartnerMD» | en | Red de atención primaria (médicos) de EE. UU.; muestra exactamente la variante con silla. |
| flexion-mesa-l2 | Flexión inclinada en mesa | https://www.youtube.com/watch?v=yItUwrTTyMA | Marc McShane, DPT, OCS — «Incline Push-Up (a.k.a. Table Push-Up)» | en | Doctor en Fisioterapia con certificación de especialista ortopédico (OCS, ABPTS). |

**Resultado:** 10 de 12 cartas con video verificado (4 en español). Pendientes de un buen video: `remo-toalla-iso-l1`,
`step-jacks-l1`. Si el Entrenador o Brooks proponen uno, basta con añadir `videoUrl` + `videoSource` a la carta,
verificarlo con oEmbed y sumar la fila aquí (un test exige que cada video de las cartas aparezca en esta tabla).

## Cómo verificar de nuevo

```bash
node -e "for (const c of require('./content/cards/adulto-general.draft.json')) if (c.videoUrl) console.log(c.id, c.videoUrl)" |
while read id url; do printf '%s\t' "$id"; curl -s "https://www.youtube.com/oembed?url=$url&format=json" | node -pe "j=JSON.parse(require('fs').readFileSync(0));j.title+' | '+j.author_name"; done
```

Un video retirado devuelve 404/401 en oEmbed: quita el campo de la carta o reemplázalo.
