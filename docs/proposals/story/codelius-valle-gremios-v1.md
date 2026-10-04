# Mundo de SnapFit: «El Valle de los Gremios» (nombre provisional)

> **Archivado (2026-10-03).** Esta es la v1 de `docs/story/WORLD.md`. La sustituyó **WORLD.md v2 «Vitalia · La Orden del Aliento»** cuando Brooks eligió el nombre del reino. Se conserva como referencia; su paquete `content/stories/valle-gremios/` sigue instalado (borrador).

> **v1, borrador abierto a propuestas.** Escrito por Codelius el 2026-10-03 a partir de la elección de Brooks: estilo B, fantasía RPG con gremios por grupo muscular. El nombre del reino todavía está por decidir; las alternativas son Ferrania, Tierras de Vigor y Ciudadela del Movimiento. Para proponer cambios, crea `docs/proposals/story/<modelo>.md` siguiendo `docs/PARALLEL-WORK.md`. Brooks decide.

## 1. Premisa

El Valle de los Gremios fue durante siglos un reino que se mantenía vivo con movimiento: los molinos giraban, las forjas ardían y los barcos zarpaban porque su gente se movía todos los días. Siete gremios guardaban ese saber, cada uno dedicado a una parte del cuerpo.

Un día llegó **la Quietud**, una niebla gris que invita a sentarse "solo un rato más". Los aldeanos dejaron de moverse, los gremios se fueron vaciando y el valle empezó a perder su color.

Tú eres un **aprendiz** que encontró el **Mazo de los Gremios**, un mazo de cartas donde cada gremio dejó sus movimientos. Cada vez que haces una carta y tocas **¡Listo!**, la niebla retrocede un poco: vuelve a encenderse una forja, gira un molino o regresa un color.

**Logline:** *Una carta, un movimiento, y un rincón del valle que vuelve a la vida.*

## 2. Entorno

- Es un valle de fantasía cálido y luminoso, al estilo de Sea of Stars u Octopath Traveler: pixel art de 16 bits, pulido y con buena iluminación, nada que recuerde a MS-DOS.
- Las regiones se van despejando a medida que subes de nivel global:

| Nivel | Región |
|-------|--------|
| 1 | Aldea del Aprendiz |
| 2 | Molinos del Río |
| 3 | Bosque de los Robles |
| 4 | Puerto de las Velas |
| 5 | Paso de la Montaña |
| 6 | Dunas de Ámbar |
| 7 | Lago Espejo |
| 8 | Forja del Volcán |
| 9 | Picos de Nube |
| 10 | Ciudadela de los Gremios |

- Cada región que queda libre de la niebla se ilumina en el mapa de Progreso.

## 3. Los siete gremios (uno por grupo muscular)

Los **ids** de grupo no cambian nunca, porque los usa el core. En la app se muestra el nombre del gremio junto al grupo muscular para que se entienda sin conocer la historia, por ejemplo «Gremio de Tierra · Piernas».

| id | Gremio | Maestro/a | Elemento y colores | Lore |
|----|--------|-----------|--------------------|------|
| `piernas` | Gremio de Tierra | Maestro Bruno, el Caminante | Tierra · verde y bronce | Abre caminos y sostiene el valle con cada paso |
| `gluteos` | Gremio del Puente | Maestra Inés, la Constructora | Piedra · rosa y cobre | Mantiene firmes los puentes y los arcos |
| `empuje` | Gremio de la Forja | Maestro Toro, el Herrero | Fuego · rojo y oro | Empuja los fuelles que encienden las forjas |
| `traccion` | Gremio de las Velas | Capitana Mar, la Marinera | Agua · azul y plata | Jala las cuerdas para que los barcos zarpen |
| `core` | Gremio del Escudo | Guardián Roble | Madera · verde oscuro y oro | El centro firme que protege a todos |
| `movilidad` | Gremio del Viento | Maestra Brisa, la Danzante | Aire · turquesa y blanco | Desata nudos y abre caminos cerrados |
| `cardio` | Gremio del Corazón | Maestro Lumbre | Luz · morado y ámbar | Marca el ritmo de todo el valle |

## 4. Personajes

| Personaje | Rol | Dónde aparece |
|-----------|-----|---------------|
| **El aprendiz** (tú) | Portador del Mazo. El avatar se elige al crear el perfil: género, apariencia y ropa | Progreso y logros |
| **Pip**, zorro mensajero de los gremios | Guía y narrador con humor amable | Bienvenida, felicitaciones, recordatorios y burbujas de ayuda |
| **Los siete maestros** | Cada uno ilustra su familia de cartas y te reconoce cuando subes de rango en su gremio | Marcos de las cartas y pantallas de subir de nivel |
| **La Quietud** | Antagonista abstracta, una niebla gris que invita a quedarse quieto. Nunca culpa al jugador | Fondo del mapa, que se colorea con tu progreso |
| **Aldeanos** (niños, adultos y mayores) | Representan a todas las personas; aparecen en los mazos por edad | Arte de mazos especiales |

## 5. Rangos dentro de cada gremio

La dificultad de cada carta va del nivel 1 al 10 y la define Entrenador. El rango cambia el borde del marco de la carta:

| Rango | Niveles | Borde |
|-------|---------|-------|
| Aprendiz | 1–3 | Bronce |
| Oficial | 4–6 | Plata |
| Maestro | 7–9 | Oro |
| Leyenda | 10 | Gema brillante |

## 6. Cómo se conecta la historia con la mecánica

| Mecánica | Qué significa en el mundo |
|----------|---------------------------|
| **Mazo** | El Mazo de los Gremios. Se baraja según tu perfil y tu nivel |
| **Carta en pantalla** | El movimiento que el valle necesita ahora |
| **Tocar la carta** (se voltea) | Leer el pergamino del gremio: video del movimiento, pasos y cuidados |
| **¡Listo!** | La niebla retrocede, Pip celebra y vuelve un poco de vida al valle |
| **Otro** | La carta regresa al fondo del mazo. No hay castigo: el valle espera |
| **Barras de progreso** | Cuánta luz volvió hoy, tu racha de farol encendido y tu fuerza en cada gremio |
| **Subir de nivel** | El maestro del gremio te reconoce y te da un sello |
| **Insignias** | Sellos de los gremios, que se pueden compartir |
| **Racha** | El farol del aprendiz. Una carta al día lo mantiene encendido; la brasa de reserva es el comodín semanal |
| **Recordatorios** | Pip avisa que un gremio necesita ayuda (por ejemplo, «La forja se enfría, ¿un movimiento?») |

## 7. Tono

- Optimista, amable y con humor ligero. Celebra los avances pequeños.
- **Nunca** culpa, castiga ni habla de peso o forma del cuerpo.
- Español neutro, tuteo y frases cortas.
- Es inclusivo: hay aprendices de cualquier edad, sexo y condición física.

## 8. Bienvenida (v1)

1. «El valle se quedó quieto. Una niebla gris apagó las forjas y detuvo los molinos.»
2. «Los siete gremios guardaron sus movimientos en un mazo… y ese mazo te encontró a ti.»
3. «Cada carta que hagas devuelve un poco de vida al valle.»
4. «Soy Pip. Te acompaño. ¿Empezamos?»

Botón: **¡Abrir el mazo!**

## 9. Pendientes para storyteller y los modelos

- Elegir el nombre definitivo del reino.
- Escribir el diálogo de Pip en la bienvenida, las felicitaciones, los recordatorios y al subir de nivel.
- Dar nombres temáticos a las insignias.
- Escribir el texto de ambientación de cada carta (una línea).
- Crear mazos especiales para niños y adultos mayores con su propio arte.
- Afinar el paquete `content/stories/valle-gremios/` (ya existe en borrador; ver `docs/story/STORY-PACKS.md`).
## 10. En la app

Esta historia ya existe como **paquete** `content/stories/valle-gremios/` (estado `draft`). Se previsualiza con `?story=valle-gremios`. El formato, la validación y cómo crear otras historias (por ejemplo, la variante mágica de la orden de magos) están en **`docs/story/STORY-PACKS.md`**. El paquete por defecto sigue siendo `pixelandia` hasta que Brooks elija.
