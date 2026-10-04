# SnapFit — «La Orden del Aliento»: magia como capa del reino

- **Modelo / agente:** storyteller (agente Hermes NexIA) · **Fecha:** 2026-10-03 (CDMX) · **Tarjeta Kanban:** `t_dd703f45`
- **Rama sugerida:** `story/storyteller-magia` · **Fichero:** `docs/proposals/story/storyteller-magia.md`
- **Herramientas y costo:** solo texto escrito por el agente. Sin APIs, sin modelos de imagen/video, sin assets. $0.
- **Licencia del contenido:** CC BY 4.0 · Atribución: `SnapFit — storyteller (NexIA), 2026. CC BY 4.0.`
- **Estado:** listo para integrar. Dos decisiones quedan en **Brooks**: el nombre del reino (§3) y la versión de la desaparición de la Orden (§1.2). Ninguna bloquea el resto del documento.
- **Base leída:** `docs/story/WORLD.md` v1 («El Valle de los Gremios»), `docs/PARALLEL-WORK.md`, `docs/proposals/README.md`, `docs/proposals/story/codelius-pixelandia-v0.md`, `docs/story/WELCOME-COPY.md`, `content/story/pixelandia.json`, `content/cards/adulto-general.draft.json`, `content/leveling.json`, `docs/01-PRODUCT.md` §4, `AGENTS.md`, y la entrega previa de tono `SnapFit_tono_microcopy_v1.md` (tarjeta `t_22eec52e`).

---

## Idea en una línea

Los ejercicios son **hechizos de un solo gesto**: una orden de magos antigua los escribió hace siglos, se disolvió, y ahora tú —joven aprendiz— los lanzas carta a carta para que la Quietud (una niebla gris que invita a quedarse quieto) deje de apagar el reino.

## Por qué encaja con SnapFit

- **Público 13+ y tono:** la magia es decorado, no juicio. El antagonista es *la quietud*, nunca el cuerpo del jugador: no hay culpa ni promesas de salud en ninguna línea de este documento.
- **Mecánica intacta:** `¡Listo!` sigue lanzando, `Otro` sigue sin castigo, voltear sigue abriendo instrucciones. La ficción explica la mecánica existente; no la reemplaza.
- **Cero dependencias nuevas:** es narrativa pura (texto). No toca `src/**`, ni `content/cards/**`, ni `content/decks/**`, ni IDs de grupos (`piernas, gluteos, empuje, traccion, core, movilidad, cardio`), ni IDs de insignias, ni `content/story/active.json`.
- **Encaja con `WORLD.md` v1:** conserva gremios, maestros, elementos, regiones por nivel y las reglas de tono; solo añade la capa mágica que pidió Brooks.

## Qué hace este documento / qué no

| Hace | No hace |
|------|---------|
| Escribe el mundo mágico completo (§1) y su mapeo con la mecánica (§2) | No cambia `content/story/active.json` ni activa nada |
| Propone 8 nombres de reino con etimología y top 3 (§3) | No elige el nombre: eso lo hace Brooks |
| Da bienvenida y ambientación listas para copiar (§4) | No toca código, CSS, cartas, dosis ni fuentes |
| Da nombres de escuelas y rangos con sus IDs intactos (§5) | No renombra IDs: solo cambia texto visible |
| Traduce los textos arcade a skin medieval-mágico (§6) | No crea assets (ilustraciones, sprites, audio) |

## Capturas 390×844

No aplican todavía: este cambio es un documento en `docs/proposals/`, sin UI ni JSON activo. Las capturas se generan cuando Brooks elija una historia y alguien entregue `content/story/<id>.json` (flujos `?story=<id>` de `docs/PARALLEL-WORK.md` §4).

## QA / verificación

Auto-revisión ejecutada con script propio sobre este fichero: conteo de líneas de bienvenida, longitud de botón (≤ 28), longitud de ambientación (≤ 60) y barrido de palabras vetadas de la guía de tono §1.5 (`t_22eec52e`). Resultados en §8.

---

## 1. Desarrollo del mundo

### 1.1 La Orden del Aliento

**Nombre:** **La Orden del Aliento** (los y las miembros: «los de la Orden»; en plano corto: «la Orden»).
*Por qué este nombre:* encaja con el reino propuesto **Alentia** (§3), es corto, se dice en voz alta, y «aliento» es exactamente lo que une ficción y ejercicio: sin respiración no hay movimiento ni magia.

**Su descubrimiento (hace ocho siglos).** Siete personas de oficio —un herrero, una tejedora, un caminante, una carpintera, un marinero, un guardabosques y una cocinera— notaron que un **gesto repetido con el aliento correcto** abría una corriente invisible: la tierra respondía, las piedras se ordenaban, las velas se llenaban solas. No había varita ni hechizo leído de un libro: la magia se hacía **con el cuerpo**. Fundaron la Orden del Aliento y repartieron la corriente en **siete escuelas**, una por cada parte del cuerpo que gobierna un oficio.

**Su leyenda escrita.** La Orden escribió todo en **el Gran Grimorio**: cada movimiento, su respiración, sus cuidados. Como el grimorio era inmenso, cada escuela copió su parte en un **cuaderno** (el de cada gremio), y la parte que servía para viajar —un gesto, un dibujo, una advertencia— la recortaron en **cartas**: así nació el mazo.

**Sus dos lemas** (sirven para textos de nivel, insignias y portada del grimorio):

- **«Un aliento basta para empezar»** (lema de bienvenida, anti-exigencia).
- **«La Quietud no se combate con fuerza, sino con constancia»** (lema de subida de rango).

**Regla de oro de la ficción (no negociable):**
> *Ningún hechizo se lanza sin moverse.* La magia de este reino es literal: se hace con el cuerpo. Así el juego nunca puede leerse como «magia que te salva sin esfuerzo», y nunca como juicio sobre tu cuerpo.

### 1.2 Por qué desapareció la Orden

**Versión recomendada (A) — «gastaron todo su aliento».**
Hace tres siglos llegó la primera Quietud. La Orden respondió con el mayor hechizo que tenía, el **Velo del Aliento**, y logró replegar la niebla hasta las montañas. Pero el Velo se pagó con todo el aliento de los siete: no murieron, **se quedaron sin voz**. La niebla se los llevó como se lleva un recuerdo, y quedaron convertidos en **los Susurrantes**: ecos que susurran en las regiones todavía grises. Antes de apagarse repartieron lo que sabían: los cuadernos a los siete gremios, y el Gran Grimorio partido en un mazo, «para que alguien más termine lo que empezamos».

*Qué explica:* por qué hay mazo y no grimorio entero · por qué la niebla vuelve (el Velo era temporal) · por qué **tú** tienes que hacerlo (solo un aliento nuevo puede sostenerlo) · de dónde salen los Susurrantes (guiño narrativo barato, solo texto).

**Versión alternativa (B) — «se disolvieron a propósito».**
La Orden entendió que una orden de pocos nunca vencería a la quietud de muchos. Decidió **repartirse**: los siete fundadores se repartieron por el reino para enseñar a cualquiera, dejaron el grimorio partido en un mazo y borraron su propio nombre para que nadie siguiera esperando héroes. Hoy viven dispersos como ancianos de aldea que «saben mucho de respiración».

*Qué explica:* un tono más luminoso, sin desaparición triste; útil si Brooks prefiere cero melancolía. Con B, los maestros de gremio pueden ser últimos discípulos directos.

**Recomendación:** A. Da consecuencia real al antagonista y convierte al jugador en heredero, sin volver triste el juego (la niebla se disipa con luz y color; nadie muere). B queda como plan si se pide algo más cálido para público menor.

### 1.3 Las siete escuelas (una por grupo muscular)

Los **ids no cambian**; la escuela es el nombre mágico de la misma familia. Regla de nombramiento aplicada: **objeto concreto que se puede dibujar** (ayuda a director-creativo y disenador), nunca abstracción.

| id (fijo) | Escuela de la Orden | Gremio y maestro (`WORLD.md`) | Elemento | La magia que domina | Cómo se llama en una frase |
|-----------|--------------------|-------------------------------|----------|---------------------|----------------------------|
| `piernas` | **Escuela de la Raíz** | Gremio de Tierra · Maestro Bruno, el Caminante | Tierra · verde y bronce | Hechizos de sostén y paso: lo que se hunde en la tierra y te vuelve a levantar | «La Raíz abre caminos» |
| `gluteos` | **Escuela del Arco** | Gremio del Puente · Maestra Inés, la Constructora | Piedra · rosa y cobre | Hechizos que elevan y sujetan: puentes, elevaciones, bisagras | «El Arco no se quiebra» |
| `empuje` | **Escuela de la Palma** | Gremio de la Forja · Maestro Toro, el Herrero | Fuego · rojo y oro | Hechizos que expulsan hacia afuera: lo que empuja el mundo lejos | «La Palma enciende» |
| `traccion` | **Escuela de la Cuerda** | Gremio de las Velas · Capitana Mar, la Marinera | Agua · azul y plata | Hechizos que atraen: jalar, remolcar, traer el viento | «La Cuerda zarpa» |
| `core` | **Escuela del Sello** | Gremio del Escudo · Guardián Roble | Madera · verde oscuro y oro | Hechizos que firman el centro: lo que sostiene todo lo demás sin moverse | «El Sello no cae» |
| `movilidad` | **Escuela del Nudo** | Gremio del Viento · Maestra Brisa, la Danzante | Aire · turquesa y blanco | Hechizos que desatan: lo que abre lo que estaba cerrado | «El Nudo se afloja» |
| `cardio` | **Escuela del Latido** | Gremio del Corazón · Maestro Lumbre | Luz · morado y ámbar | Hechizos que marcan el ritmo: el pulso que ordena al resto | «El Latido marca el paso» |

**Por qué son siete y no más:** siete grupos musculares (contrato de `docs/03-CONTENT.md`), siete oficios fundadores, siete cuadernos. La simetría hace que cualquiera entienda la regla sin tutorial.

**Alternativas de nombre** (si a Brooks no le gustan): Raíz → *Huella* · Arco → *Puente* · Palma → *Fuelle* · Cuerda → *Eslabón* · Sello → *Eje* · Nudo → *Cierro* · Latido → *Faro*.

### 1.4 Progresión: de aprendiz a archimago (niveles 1–10)

Mantiene las bandas y los bordes de `WORLD.md` §5 (niveles 1–3 / 4–6 / 7–9 / 10; bronce, plata, oro, gema). **Solo cambia el texto visible de los rangos**, que es lo que pidió Brooks (aprendiz → archimago).

| Nivel | Rango (propuesto) | Borde del marco | Qué vives en la historia | Alternativas de rango |
|-------|-------------------|-----------------|--------------------------|-----------------------|
| 1–3 | **Aprendiz** | Bronce | Encontraste el mazo; la Quietud solo toca las orillas del valle. Aprendes los gestos básicos con Pip. | Iniciado · Novato |
| 4–6 | **Adepto** | Plata | La corriente te responde: cada escuela te reconoce y tu grimorio empieza a susurrarte. La niebla cede el centro. | Aprendiz de la Corriente · Arcanista |
| 7–9 | **Magister** | Oro | Dominas tus escuelas; los Susurrantes ya te escuchan y las regiones altas se iluminan. | Maestro Arcano · Custodio |
| 10 | **Archimago** | Gema | Coronación en la Cúpula del Aliento. El Velo se refuerza contigo dentro: el reino queda sostenido por tu constancia. | Leyenda del Aliento |

**Notas de integración:**

- Aplica igual al **rango por escuela** (borde de la carta) y al **nivel global** (regiones), como en `WORLD.md`.
- Los títulos `tiers.1..4` del JSON de historia son solo texto; la clave no cambia. Hoy dicen `Bronce/Plata/Oro/Leyenda` (materiales); se proponen sustituir por los cuatro títulos mágicos y dejar el material en el subtítulo del borde (`Bronce · Aprendiz`) si se quiere conservar el dato visual.
- **Cuándo se sube lo decide el motor, no la historia:** umbrales en `content/leveling.json` (borrador de Codelius, validación de Entrenador). La narrativa solo narra el hecho; nunca promete «sube si…».
- Evité «Maestro» como rango porque ya es el título de los siete guías de gremio (Maestro Bruno, Maestra Inés…): habría dos «maestros» en la misma pantalla.

### 1.5 La Quietud: antagonista sin culpa

Ya existe en `WORLD.md` («una niebla gris que invita a sentarse solo un rato más»). Con magia, la Quietud pasa a ser **el hechizo que no se lanza**: todo lo que la corriente mueve, ella lo detiene.

**Qué es:** niebla gris que apaga color y sonido, detiene molinos y forjas y empaña el mapa.
**Qué no es:** no es un monstruo, no tiene cara, no se golpea ni se «mata»: **se disipa**. No odia al jugador: lo invita.

**Reglas rojas de la Quietud** (checklist obligatoria en cualquier texto futuro suyo):

1. **Nunca** nombra cuerpo, peso, comida, apariencia, ropa ni espejo. Su campo es el *tiempo* y la *quietud*, no la persona.
2. **Nunca acusa.** Solo tentación amable, nunca reproche («quédate, el sofá espera», jamás «te quedaste quieto otra vez»).
3. **Nunca** promete salud ni amenaza con enfermedad; su promesa es falsa comodidad.
4. **Nunca** dice que algo va a salir mal si no juegas hoy. Nada de amenaza, nada de castigo.
5. **Siempre** va acompañada de la respuesta de Pip, sin culpa, con salida concreta.
6. Frases cortas (≤ 40 caracteres), en cursiva o en gris, nunca en rojo de error.

**Tres duelos de ejemplo (Quietud → Pip):**

| La Quietud susurra | Pip responde |
|--------------------|--------------|
| «Un rato más y empiezas» | «Sin prisa. Una carta y decides» |
| «Mañana habrá más tiempo» | «Dos minutos alcanzan para un hechizo» |
| «Déjalo para después» | «La espera no avanza el mapa. ¿Lo lanzamos?» |

### 1.6 Mentor, guías y personajes

| Personaje | Rol con la capa mágica | Dónde aparece |
|-----------|------------------------|---------------|
| **El aprendiz** (tú) | Portador del mazo y último heredero de la Orden. El avatar se elige al crear el perfil | Progreso, logros, compartir |
| **Pip**, zorro mensajero | **Guía principal.** Guiño barato de lore: Pip sirvió a la Orden y por eso vive mucho; es el único que la recuerda entera. Humor amable, nunca regaña | Bienvenida, felicitaciones, recordatorios, burbujas de ayuda |
| **La Voz del Grimorio** | Fragmento de la Orden que susurra **una sola línea** al subir de nivel o de rango. Tono solemne, corto. Es texto puro: no requiere sprite | Pantallas de subir de nivel y de rango |
| **Los siete maestros** | Cada uno reconoce tu dominio en su escuela y «sella» tu grimorio | Marcos de carta y subida de nivel |
| **Los Susurrantes** 🔻 | Ecos de los fundadores (versión A de §1.2) que aparecen cuando se libera una región. *Opcional: decisión de director-creativo con Brooks* | Fondo de regiones todavía grises |
| **La Quietud** | Antagonista (§1.5) | Fondo del mapa, que se colorea con tu progreso |
| **Aldeanos** | Todas las personas; van en los mazos por edad | Arte de mazos especiales |

🔻 = pendiente de decisión de terceros; el resto ya estaba en `WORLD.md`.

### 1.7 Regiones del reino

Se conserva la tabla por nivel de `WORLD.md` §2 (es el contrato de progresión) y se le añade la capa mágica:

| Nivel | Región | Qué guarda / qué se libera con tu aliento |
|-------|--------|-------------------------------------------|
| 1 | Aldea del Aprendiz | El mazo se abrió aquí. Solo hay faroles encendidos |
| 2 | Molinos del Río | Vuelven a girar: la corriente es agua que empuja |
| 3 | Bosque de los Robles | Los Susurrantes empiezan a susurrarte en voz baja |
| 4 | Puerto de las Velas | Las velas se llenan solas cuando lanzas hechizo |
| 5 | Paso de la Montaña | La niebla más fina: el Velo empieza a responder |
| 6 | Dunas de Ámbar | Arena que recuerda los pasos de la Orden |
| 7 | Lago Espejo | El agua devuelve tu figura de aprendiz: ya no eres solo uno |
| 8 | Forja del Volcán | La última forja encendida; aquí se hicieron las cartas |
| 9 | Picos de Nube | Sobre las nubes, la Quietud no llega |
| 10 | Ciudadela de los Gremios | **La Cúpula del Aliento**: sala del Gran Grimorio y corona de Archimago 🔻 *nombre de la cima: Brooks decide* |

Cada región liberada se ilumina en el mapa de Progreso (mecánica ya definida). Propuesta menor: si Brooks quiere, la región 10 puede llamarse **Cúpula del Aliento** en lugar de «Ciudadela de los Gremios»; las demás se mantienen.

---

## 2. Mapeo historia ↔ mecánica

**Tres capas, un solo objeto.** Para no enredar a quien implemente:

- **Real:** el ejercicio (sentadilla, flexión…) → lo define Entrenador.
- **Juego:** la **carta** (objeto del mazo, nivel 1–10) → lo define el core.
- **Ficción:** el **hechizo** (lo que la carta lanza) → lo define este documento.

«Carta» y «hechizo» conviven a propósito: la carta es lo que ves, el hechizo es lo que pasa.

| Mecánica | Significado en el mundo | Dónde se ve |
|----------|-------------------------|-------------|
| **Mazo** | El mazo de la Orden: el Gran Grimorio partido en cartas. Se baraja con tu perfil y tu nivel | Pantalla Carta |
| **Carta en pantalla** | El hechizo que el reino necesita ahora | Frente de la carta |
| **Voltear la carta** | **Abrir el pergamino** de la escuela: video del movimiento, pasos, cuidados y fuentes | Reverso / detalle |
| **¡Listo!** | **Lanzar el hechizo.** Sale tu aliento: la niebla retrocede un poco, se enciende un farol, vuelve color | Felicitación |
| **Otro** | El hechizo **vuelve al fondo del mazo a esperar su turno**. Sin castigo: la Quietud no avanza por eso y el valle espera | Animación «al fondo» |
| **Felicitación** | Pip celebra y el gremio anota tu gesto en su cuaderno | `rewards` del JSON |
| **Barras de progreso** | *Del día:* cuánta luz volvió hoy · *por escuela:* cuánto poder domina esa escuela · *de rango:* qué tan cerca estás del siguiente sello | Progreso |
| **Subir de nivel** | El maestro de la escuela reconoce tu mano y **sella tu grimorio**; la Voz del Grimorio da una línea | Subida de nivel |
| **Subir/bajar de rango** | El motor propone y tú confirmas; narrativamente es «más carga, más poder», nunca «no pudiste» | Propuesta de nivel |
| **Insignias** | **Sellos de la Orden**, firmados por los gremios; se comparten como prueba de hechizo | Logros / compartir |
| **Racha** | **El farol del aprendiz.** Una carta al día lo mantiene encendido; la **brasa de reserva** es el comodín semanal | HUD / Progreso |
| **Recordatorios** | Pip avisa que la niebla se espesa o que un gremio pide ayuda | Notificaciones locales |
| **Desbloqueo de cartas más fuertes** | Subes de nivel → el grimorio te entrega hechizos mayores (cartas de nivel superior) | Baraja asignada |
| **Registro de esfuerzo (Fácil/Bien/Duro)** | **Queda fuera de la ficción:** es dato real tuyo para el motor. No se vuelve magia, para que «duro» nunca se lea como fracaso | Tras ¡Listo! |
| **Aviso de salud** | **Fuera de la ficción.** Voz real, no de personaje; ya entregado en `t_22eec52e` (pendiente de Entrenador) | Onboarding y detalle |
| **Perfil y avatar** | Tu aprendiz: género, apariencia y ropa | Onboarding |

### 2.1 Textos de ejemplo listos para `content/story/<id>.json`

Son propuestas de contenido; **no** cambian `active.json`. Si Brooks elige esta historia, se copian al JSON correspondiente.

**`rewards` (7, títulos aleatorios de felicitación):**

1. `¡Hechizo lanzado!`
2. `¡La niebla retrocede!`
3. `Un rincón del reino vuelve a brillar.`
4. `El gremio celebra contigo.`
5. `Tu aliento va creciendo.`
6. `La corriente respondió.`
7. `Un gesto, un hechizo, un farol encendido.`

**`reminders` (3, notificación ≤ 60 caracteres):**

1. `La niebla se espesa. ¿Un hechizo de dos minutos?`
2. `Tu farol pide su carta de hoy.`
3. `El grimorio lleva días sin abrirse. ¿Lo abrimos?`

---

## 3. Nombre del reino: 8 propuestas con etimología

Todos suenan a reino antiguo y apuntan a **salud** por su raíz latina. Van ordenados por recomendación dentro de su familia.

| # | Nombre | Etimología breve | Cómo queda en uso | Veredicto |
|---|--------|------------------|-------------------|-----------|
| 1 | **Vigoría** | lat. *vigor* (fuerza, energía de lo vivo; de *vigēre*, «estar lleno de vida») + *-ía* (lugar) | «Del Reino de Vigoría» · «los caminos de Vigoría» | ⭐ Mejor equilibrio: reino antiguo + salud sin decir «salud» en voz alta. Corto, sonoro, sin choque con el lore |
| 2 | **Salubria** | lat. *salubris* («que da o goza de salud») de *salus* (salud, integridad) + sufijo toponímico *-ia* (como *Hispania*, *Augusta*) | «Las tierras de Salubria» · «el valle de Salubria» | ⭐ La más explícita en salud; suena romana y encaja con gremios y valle |
| 3 | **Alentia** | lat. *halitus* (aliento, exhalación) → aliento | «Alentia y su Orden del Aliento» | ⭐ La más narrativa: el reino lleva el nombre de la magia. Único riesgo: rima con «Orden del Aliento» (para unos es elegante, para otros repetitivo) |
| 4 | **Roburia** | lat. *robur* (roble; también «fuerza firme, vigor») + *-ia* | «El bosque de Roburia» | Muy bonita y con gancho directo al Guardián Roble y al gremio del core. Menos «salud» y más «fuerza» |
| 5 | **Valetia** | lat. *valetudo* (estado de salud, vigor; de *valēre*, «estar bien») → raíz *val-* | «Antiguamente se llamaba Valetia» | La más rara y crónica-medieval. Cuidado con la lectura (va-LE-tia) en voz alta |
| 6 | **Vitalia** | lat. *vita* (vida) + *-ia* | «El reino de Vitalia» | La más legible y la más genérica: marcas de salud ya usan *Vitalis* por doquier. Menos distintiva |
| 7 | **Cordaria** | lat. *cor, cordis* (corazón) + *-aria* | «El reino de Cordaria» | Suena a reino y apunta al corazón (cardio). Puede confundirse con «cordal» al dictarla |
| 8 | **Salvia Real** | lat. *salvia* («la que salva», de *salvare*; la hierba de la salud) + *real* (del rey) | «El Reino de Salvia Real» | La más encantadora, pero suena a hierba y a tesorería. Mejor como **capital o región** (p. ej. el Lago Espejo) que como reino entero |

### Top 3 (recomendación de storyteller)

1. **Vigoría** — si Brooks quiere el nombre que mejor suena a *reino viejo y a cuerpo sano* al mismo tiempo, sin explicarse.
2. **Salubria** — si se quiere que la salud se lea de entrada y que el nombre tenga aroma de crónica antigua.
3. **Alentia** — si se quiere que la magia mande y que reino y orden sean una sola idea.

### Comparación con los candidatos que ya están en `WORLD.md`

| Candidato existente | Raíz | Lectura |
|---------------------|------|---------|
| Ferrania | lat. *ferrum* (hierro) | Suena a mineral y a industria, no a salud. El reino mágico pide aliento, no yunque |
| Tierras de Vigor | *vigor* | Va por buen camino pero es larga, genérica y sin acento de reino; **Vigoría** la condensa y la suena |
| Ciudadela del Movimiento | descriptiva | Describe la mecánica, no suena a reino antiguo. Sirve como subtítulo: «Ciudadela del Movimiento» puede ser la región 10 |
| El Valle de los Gremios (provisional) | descriptiva | Perfecto mientras no haya nombre propio; **consérvale como apodo popular**: «el Valle», como los aldeanos llaman a Vigoría |

---

## 4. Bienvenida y ambientación

### 4.1 Bienvenida (5 líneas + botón)

- **Título:** `El Reino de {Nombre}` (placeholder hasta que Brooks elija; si se aprueba Alentia: *«Alentia»*).
- **Líneas** (aparecen una tras otra; el JSON admite 1–5):

1. `La Quietud cubrió el reino de niebla: las forjas se apagaron y los pasos se detuvieron.`
2. `Los siete gremios guardaron los hechizos de la Orden del Aliento en un mazo…`
3. `Ese mazo te eligió a ti: cada carta que lanzas devuelve luz al reino.`
4. `Empiezas como aprendiz. Con cada nivel, un hechizo más grande.`
5. `Soy Pip. Te acompaño. ¿Lanzamos el primero?`

- **Botón (≤ 28 caracteres):** `Despertar el mazo` (17 caracteres).
  Alternativas: `¡Lanzar el primer hechizo!` (26) · `Abrir el grimorio` (17) · `¡Abrir el mazo!` (15, el que ya usa `WORLD.md` v1).
- **Nota:** `Historia provisional · Brooks elige el nombre final.`

### 4.2 Ambientación de ejemplo (≤ 60 caracteres, sin punto final)

Todas ≤ 60 caracteres con espacios, sin culpa, sin promesa de resultado, sin emoji (reglas de `flavorText` de `t_22eec52e` §5).

| Carta (id real del borrador) | Escuela | Ambientación | Caracteres |
|------------------------------|---------|--------------|------------|
| `sentadilla-silla-l1` · Sentadilla a la silla | Raíz (`piernas`) | `La raíz empuja: vuelves a subir` | 31 |
| `flexion-pared-l1` · Flexión en la pared | Palma (`empuje`) | `Tu palma enciende la pared` | 26 |
| `marcha-sitio-l1` · Marcha en el sitio | Latido (`cardio`) | `Un paso, un latido, un farol` | 28 |

**Dos extra** (por si se quiere el set completo de tracción y core):

| Carta | Escuela | Ambientación | Caracteres |
|-------|---------|--------------|------------|
| `remo-toalla-iso-l1` · Remo isométrico con toalla | Cuerda (`traccion`) | `Tira: la vela busca el viento` | 29 |
| `perro-pajaro-l1` · Perro-pájaro | Sello (`core`) | `El sello no se cae` | 18 |

---

## 5. Nombres: 7 escuelas/gremios y 4 rangos

### 5.1 Escuelas (los 7)

`Escuela de la Raíz` · `Escuela del Arco` · `Escuela de la Palma` · `Escuela de la Cuerda` · `Escuela del Sello` · `Escuela del Nudo` · `Escuela del Latido`
(ids fijos: `piernas`, `gluteos`, `empuje`, `traccion`, `core`, `movilidad`, `cardio` — en ese orden)

### 5.2 Rangos (los 4)

`Aprendiz` (1–3, bronce) · `Adepto` (4–6, plata) · `Magister` (7–9, oro) · `Archimago` (10, gema)

### 5.3 Cómo se muestran (etiquetas visibles)

- **Superficie con lore** (bienvenida, subida de nivel, marco de carta, compartir): etiqueta doble, como pide `WORLD.md` — `Escuela de la Raíz · Piernas`.
- **Superficie compacta** (chips, listas, notificaciones): el grupo muscular solo — `Piernas`. Así quien no conoce la historia sigue entendiendo el juego.
- **Nunca** se cambia el `id`; solo cambia el texto visible. El test `tests/content/copy-story.test.js` sigue exigiendo las 7 familias y los `tiers.1..4`.

---

## 6. Coordinación con la entrega de tono (`t_22eec52e`)

Mi entrega anterior (`SnapFit_tono_microcopy_v1.md`) definió **voz, reglas anti-culpa, presupuestos de largo y palabras vetadas**: todo eso **sigue vigente**. Lo que choca con el nuevo estilo B es el **skin arcade** («combo», «XP», «pixel»). Si Brooks confirma el estilo medieval-mágico, la traducción es de sustantivos, no de voz:

| Arcade (`t_22eec52e`) | Medieval-mágico | ID / clave intacto |
|-----------------------|-----------------|--------------------|
| `Combo: {dias} días` | `Farol: {dias} días` | `streak.label` |
| `+{xp} XP` | `+{xp} de aliento` | `reward.xp` |
| «Tu personaje pixel sube» | «Tu aprendiz sube» | `reward.variants` |
| «¡Snap!» / «¡Combo!» (rewards) | Lista de §2.1 | `rewards[]` |
| «Combo nuevo: día 1» | «Farol nuevo: día 1» | `streak.start` |

**Insignias:** los **IDs de `01-PRODUCT.md` §4 son contrato y no cambian**; los nombres sí. Tres de los míos quedan desfasados con el skin mágico y conviene reponerlos en una pasada aparte (no lo hago aquí para no pisar la entrega aprobada): `streak-3/7/30` («Combo x…» → «Farol x…»), `level-10` («Leyenda Pixel» → «Archimago»), `night-owl` («Búho Arcade» → «Búho de la Quietud»). 🔻 Confirmar con Brooks en esta misma tarjeta antes de tocarlos.

---

## 7. Riesgos / dudas

1. **Dos nombres por grupo** (escuela + grupo muscular) puede saturar. Mitigación §5.3: doble etiqueta donde hay lore, grupo solo donde hay poco espacio.
2. **Elección del nombre del reino** → Brooks (§3). Mientras, `WORLD.md` conserva «El Valle de los Gremios».
3. **Versión de la desaparición de la Orden** (A recomendada / B alternativa) → Brooks (§1.2).
4. **Skin arcade vs. medieval** → decisión de Brooks; §6 da la tabla de traducción. Si gana el arcade puro, esta propuesta sigue siendo válida: solo se sustituyen los sustantivos de la tabla.
5. **Los Susurrantes** (personaje nuevo) requieren diseño si algún día se ilustran; como texto no cuesta nada. 🔻 director-creativo.
6. **La app sigue usando `content/story/pixelandia.json`.** Esta ficha no la cambia. La entrega del JSON nuevo (`content/story/<id>.json` + capturas `?story=<id>`) es un trabajo aparte, naturalmente en esta misma línea de Kanban una vez elegida la historia.
7. **Costo:** $0. Todo texto generado por el agente de la tarjeta, sin herramientas de pago.

## 8. DoD y autorevisión

- [x] **Mundo:** Orden del Aliento (nombre, historia, por qué desapareció) + 7 escuelas ligadas a los 7 ids fijos + progresión aprendiz→archimago en niveles 1–10 con rangos + Quietud con reglas rojas + mentor/guía + 10 regiones con capa mágica (§1).
- [x] **Mapeo historia↔mecánica:** carta=hechizo · `¡Listo!`=lanzar · `Otro`=vuelve al fondo sin castigo · voltear=pergamino · felicitación · barras · subir de nivel · insignias · racha · recordatorios, más esfuerzo, aviso de salud y desbloqueo (§2).
- [x] **8 nombres de reino** con etimología latina y **top 3** recomendado, más análisis de los candidatos existentes (§3).
- [x] **Bienvenida** de 5 líneas + botón de 17 caracteres (≤ 28) y **ambientación** de 3 cartas reales del borrador, 31/26/28 caracteres (≤ 60) (§4).
- [x] **7 nombres de escuela/gremio y 4 nombres de rango** con regla de etiqueta visible (§5).
- [x] **Sin culpa, sin promesas médicas, español neutro, tuteo.** Verificación por script sobre este fichero:

```
bienvenida.líneas = 5            (rango válido: 1–5)
bienvenida.cta    = 17           (límite: 28)  → "Despertar el mazo"
ambientación      = 31 / 26 / 28 (límite: 60)
extras            = 29 / 18      (límite: 60)
palabras vetadas (guía de tono §1.5) = 0
cuerpo/apariencia = 1 aparición de "peso", dentro de la regla roja §1.5
                    que lo prohíbe (uso meta, no es copy de jugador)
```

- [x] No se modificó ningún fichero fuera de `docs/proposals/story/`; IDs de grupos, insignias, temas y umbrales intactos.
