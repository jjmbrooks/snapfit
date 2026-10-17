# Audio de Vitalia

Diseño, fuentes y funcionamiento del sonido de SnapFit. Autor: Codelius, 2026-10-17. Paquete: `vitalia`
(ver docs/story/STORY-PACKS.md → «Paquete de audio»).

## 1. Qué había antes

- **Sin música** y **sin archivos de audio** en el repositorio.
- `src/ui/components/sfx.js`: cuatro efectos chiptune provisionales sintetizados con WebAudio (onda cuadrada):
  `listo`, `otra`, `logro`, `nivel`. El manifiesto admitía `assets.audio.sfx` pero ningún paquete lo usaba. `flip`
  existía en el mapa pero nunca sonaba.
- Un solo interruptor en el Menú, «Sonido chiptune», guardado en el perfil (`profile.sound`), **apagado** por defecto.
- No había sonido al voltear la carta, en la navegación, en la intro, al llegar a la meta del día ni al subir de racha.

## 2. Idea sonora: por qué suena así en Vitalia

Vitalia es un mundo de fantasía donde la **Orden del Aliento y la Quietud** enseña con **cartas-hechizo** y donde
la **niebla** cubre lo que aún no conoces. La paleta, por lo tanto:

- **Folk celta / medieval acústico** (arpa, laúd, flautas, gaitas suaves). Suena a gremio y a camino, no a
  videojuego de acción: acompaña sin acelerar el pulso.
- **Modo re dórico** (D Dorian) para lo sintetizado: es el color modal de esa música; luminoso y a la vez sereno.
- **El aliento como timbre**: el hechizo de «¡Listo!» empieza con un soplo (ruido filtrado), porque en Vitalia
  la fuerza nace de respirar.
- **La quietud como volumen**: música a −20 LUFS y al 35 % por defecto; efectos cortos, sin estridencias.
- **Papel y cartas**: voltear suena a página de grimorio; «Otro» suena a carta que se desliza al fondo del mazo.

### Música por pantalla

| Pantalla | Pista | Por qué |
|---|---|---|
| Intro / historia (onboarding y perfil) | `musica-intro` — «Skye Cuillin» (68 bpm; arpa, whistle, coro) | Lenta y misteriosa: la niebla sobre los picos antes de entrar a la Orden. Invita a leer la historia sin prisa. |
| Menú, progreso, logros, detalle, privacidad | `musica-menu` — «Teller of the Tales» (laúd y guitarra) | La posada del cuentacuentos: un lugar tranquilo para revisar tu mapa y tus insignias. |
| Sesión de ejercicio (mazo y cartas de muestra) | `musica-sesion` — «Village Consort» (95 bpm; guitarra, flautas dulces, gemshorn, percusión ligera) | Ritmo **moderado** y saltarín: da pulso para moverse, pero 95 bpm no empuja a acelerar ni a sacrificar técnica. |
| Celebración (secuencia de recompensa con hito) | `musica-celebracion` — «Enchanted Valley» (117 bpm; celesta, clarinete, flauta) | El valle se despeja: celesta brillante y mágica. Solo suena si subes de nivel, cumples la meta/racha o ganas una insignia; en una carta normal sigue la música de sesión (no cambia de pista cada minuto). |

Las pistas son fragmentos de 25–45 s con bucle sin corte (fundido de igual potencia de 2 s entre el final y el
inicio, cortado en compases completos), mono y normalizadas a −20 LUFS. Entre pantallas hay fundido de 0.8 s y
entrada de 1.2 s.

### Efectos por evento

| Evento | Archivo | Por qué |
|---|---|---|
| Voltear carta | `sfx-flip` — página de libro | La carta es un hechizo escrito: al voltearla se abre el grimorio. |
| ¡Listo! (carta completada) | `sfx-listo` — soplo + campanas re–fa–la–re | El hechizo de aliento: un soplo que se convierte en luz (arpegio ascendente en re dórico). Sintetizado por código. |
| Otro (carta al fondo) | `sfx-otro` — carta que se desliza | Neutro, sin tono de error: mandar al fondo no es fallar. |
| Insignia nueva | `sfx-logro` — pizzicato ascendente | Cuerdas pulsadas, del mismo mundo acústico que la música; sube = algo ganaste. |
| Meta del día o racha (2+ días) | `sfx-meta` — pizzicato ascendente, otra frase | Hermano de logro, más breve: constancia. Suena cuando cruzas la meta diaria o tu racha sube. |
| Subir de nivel/rango | `sfx-nivel` — fanfarria corta | El momento más grande; prioridad sobre los demás. |
| Botones y navegación | `sfx-tap` — clic suave | Táctil y discreto (no suena en «¡Listo!», «Otro», voltear ni el inicio de la historia, que tienen el suyo). |
| Inicio de la historia | `sfx-intro` — «niebla»: soplo grave que crece + bordón re/la + destellos | Al tocar «comenzar», la niebla se abre. Sintetizado por código. |

Prioridad al completar: **nivel > meta/racha > insignia > ¡Listo!** (un solo efecto; `sfxForDone` en `src/ui/audio/plan.js`).

## 3. Fuentes y licencias

Solo CC0 y CC BY 4.0. Sin costo, sin cuentas. Detalle por archivo en docs/ASSETS-PROVENANCE.md; atribuciones en
NOTICE.md y en Menú → Acerca de → Créditos.

| Uso | Archivos | Título | Autor | Licencia | URL | Cambios |
|---|---|---|---|---|---|---|
| Música intro | `musica-intro.ogg`, `musica-intro.mp3` | Skye Cuillin | Kevin MacLeod (incompetech.com) | CC BY 4.0 | https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100346 | Desde 0:10, 12 compases (42.4 s), bucle, mono, −20 LUFS |
| Música menú | `musica-menu.ogg`, `musica-menu.mp3` | Teller of the Tales | Kevin MacLeod | CC BY 4.0 | https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1400020 | Desde 0:15, 24 compases (44.3 s), bucle, mono, −20 LUFS |
| Música sesión | `musica-sesion.ogg`, `musica-sesion.mp3` | Village Consort | Kevin MacLeod | CC BY 4.0 | https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1700007 | Desde 0:30, 18 compases (45.5 s), bucle, mono, −20 LUFS |
| Música celebración | `musica-celebracion.ogg`, `musica-celebracion.mp3` | Enchanted Valley | Kevin MacLeod | CC BY 4.0 | https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1200093 | Desde 0:25, 12 compases (24.6 s), bucle, mono, −20 LUFS |
| Voltear | `sfx-flip.ogg`, `sfx-flip.mp3` | RPG Audio — `bookFlip2.ogg` | Kenney | CC0 | https://kenney.nl/assets/rpg-audio | Mono, −16 LUFS, fundido final |
| Otro | `sfx-otro.ogg`, `sfx-otro.mp3` | Casino Audio — `card-shove-1.ogg` | Kenney | CC0 | https://kenney.nl/assets/casino-audio | Ídem |
| Insignia | `sfx-logro.ogg`, `sfx-logro.mp3` | Music Jingles — `jingles_PIZZI02.ogg` | Kenney | CC0 | https://kenney.nl/assets/music-jingles | Ídem |
| Meta/racha | `sfx-meta.ogg`, `sfx-meta.mp3` | Music Jingles — `jingles_PIZZI15.ogg` | Kenney | CC0 | https://kenney.nl/assets/music-jingles | Ídem |
| Nivel | `sfx-nivel.ogg`, `sfx-nivel.mp3` | Music Jingles — `jingles_HIT15.ogg` | Kenney | CC0 | https://kenney.nl/assets/music-jingles | Ídem |
| Botones | `sfx-tap.ogg`, `sfx-tap.mp3` | Interface Sounds — `select_003.ogg` | Kenney | CC0 | https://kenney.nl/assets/interface-sounds | Ídem |
| ¡Listo! | `sfx-listo.ogg`, `sfx-listo.mp3` | Hechizo de aliento | Codelius (SnapFit) | CC BY 4.0 (como el resto del contenido) | `scripts/audio/synth.py` | **Sintetizado por código** (numpy): ruido filtrado 700–3800 Hz + 4 campanas FM aditivas + reverberación multitap |
| Inicio de historia | `sfx-intro.ogg`, `sfx-intro.mp3` | Niebla | Codelius (SnapFit) | CC BY 4.0 | `scripts/audio/synth.py` | **Sintetizado por código**: ruido 180–1400 Hz con envolvente + bordón re3/la3/re4 + 3 destellos |

Atribución de Kevin MacLeod (requerida por CC BY): «Título» Kevin MacLeod (incompetech.com). Licensed under Creative
Commons: By Attribution 4.0 License. http://creativecommons.org/licenses/by/4.0/

Se descartó: Freesound (requiere cuenta para descargar), piezas CC BY-NC/ND/SA y cualquier generador de pago.

**Nota honesta:** Codelius no puede escuchar. Los jingles se eligieron por su contorno de alturas (ascendente =
positivo), su duración y su timbre según el nombre del pack; las pistas por su metadato (tempo, instrumentos, ánimo).
Brooks debe revisarlos de oído (ver «Pendiente»).

### Tamaños

| Archivo | OGG | MP3 | Duración |
|---|---|---|---|
| musica-intro | 299 KB | 339 KB | 42.4 s |
| musica-menu | 333 KB | 355 KB | 44.4 s |
| musica-sesion | 326 KB | 364 KB | 45.5 s |
| musica-celebracion | 182 KB | 198 KB | 24.7 s |
| 8 efectos (total) | 89 KB | 90 KB | 0.4–3.8 s |

Total en el repositorio ≈ 2.6 MB, pero cada dispositivo descarga **un solo formato** y solo lo que suena.

## 4. Cómo funciona (src/ui/audio/)

- `plan.js` (puro, con pruebas en `tests/ui/audio.test.js`): música por ruta, efecto por evento, rutas del paquete
  y preferencias.
- `engine.js`: WebAudio. Un solo `AudioContext`, creado en el **primer toque o tecla** (nada suena antes, por la
  política de autoplay). Cada archivo se pide y decodifica **la primera vez que suena** (carga diferida); la música
  usa `AudioBufferSourceNode` con `loop` (bucle exacto, sin hueco). Solo se conserva en memoria la pista actual.
- Formato: OGG Vorbis si el navegador lo decodifica; si no (Safari/iOS antiguos), el `.mp3` hermano
  (`assets.audio.formats`).
- Sin red: el SW guarda cada audio pedido en la caché del paquete (`snapstory-<id>`), que se borra al cambiar de
  historia. El audio no entra en el precache inicial.
- En segundo plano el contexto se suspende; al volver, sigue.
- iOS/Safari: `navigator.audioSession.type = 'ambient'` → respeta el interruptor de silencio del teléfono y no
  interrumpe la música de otra app.
- **Preferencias** (Menú → Sonido): Silenciar todo, Música sí/no + volumen, Efectos sí/no + volumen. Se guardan en
  este dispositivo (`localStorage` `snapfit.audio`), no en la nube; no hay analítica de audio. Por defecto: efectos
  70 %, música 35 %, encendidos (pero mudos hasta el primer toque). `profile.sound` queda obsoleto.
- **Paquetes sin audio** (Pixelandia, Valle de Gremios): `audio` es identidad del paquete (`PACK_ONLY_ASSETS`), así
  que no heredan la música de Vitalia; suenan los efectos chiptune sintetizados de siempre y no hay música.

## 5. Regenerar

`scripts/audio/music.py` (recorte por compases + bucle + normalizado) y `scripts/audio/synth.py` (efectos
sintetizados) con Python 3 + numpy + ffmpeg. Los originales se descargan de las URLs de la tabla (no se guardan en el
repositorio). MP3: `ffmpeg -i x.ogg -ac 1 -b:a 64k x.mp3`.

## 6. Pendiente para Brooks

1. Escuchar todo (Menú → Sonido) y vetar lo que no encaje, sobre todo los jingles de logro/meta/nivel.
2. ¿Música encendida por defecto o apagada hasta que el usuario la active? (hoy: encendida al 35 % tras el primer toque).
3. ¿Celebración solo en hitos (actual) o en cada carta?
4. Probar en iPhone: interruptor de silencio, costura del bucle MP3 y volumen.
5. ¿Pixelandia y Valle de Gremios tendrán su propio paquete de audio (p. ej. chiptune 8-bit de Kenney, CC0)?
