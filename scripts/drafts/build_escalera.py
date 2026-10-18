# Genera content/drafts/escalera-l2-l6.json (borradores, published:false) a partir de:
#  - cards-mvp.json de Entrenador (Entrega 1, 2026-10-03): niveles 2-3 no integrados aún.
#  - Propuestas de Codelius (2026-10-17): niveles 4-6 (Adepto), sin validar.
import json, sys
SRC = sys.argv[2] if len(sys.argv) > 2 else 'docs/training/cards-mvp.json'  # Entrega 1 de Entrenador (Drive o adjunto de t_78a921ff)
out = sys.argv[1]
ent = {c['id']: c for c in json.load(open(SRC))}
# Uso: python3 scripts/drafts/build_escalera.py content/drafts/escalera-l2-l6.json <ruta a cards-mvp.json>

# ids del repo publicados (no se tocan) y equivalencias con la Entrega 1
MAP = {'remo-toalla-l1': 'remo-toalla-iso-l1', 'step-jack-l1': 'step-jacks-l1', 'zancada-apoyo-l2': 'zancada-atras-apoyo-l2',
       'flexion-inclinada-l2': 'flexion-mesa-l2', 'bird-dog-l2': 'perro-pajaro-l1', 'elevacion-talones-l1': 'talones-l1'}
MISSING_L1 = {'dead-bug-l1', 'abduccion-cadera-acostado-l1', 'sentadilla-muro-l1', 'gato-camello-l1', 'rotacion-toracica-l1', 'estiramiento-isquiotibiales-l1'}
SKIP = {'zancada-apoyo-l2', 'flexion-inclinada-l2', 'bird-dog-l2'}  # ya existen en el repo con otro id

def tier(level): return 'Aprendiz' if level <= 3 else 'Adepto' if level <= 6 else 'Magister' if level <= 9 else 'Archimago'

PROG_ENT = 'Sube cuando el grupo cumpla content/leveling.json (N cartas en D días, ≥70 % fácil/bien, sin «duro» reciente) y la dosis salga con técnica limpia y sin dolor.'

cards = []
for cid, c in ent.items():
    if c['level'] not in (2, 3) or cid in SKIP: continue
    c = json.loads(json.dumps(c))
    for k in ('easier', 'harder'):
        v = c.get(k)
        if v in MAP: c[k] = MAP[v]
        elif v in MISSING_L1: c[k] = None
    c.update({
        'draft': True, 'published': False, 'status': 'draft',
        'origin': 'entrenador-entrega-1-2026-10-03',
        'draftNote': 'Validada por Entrenador el 2026-10-03 (t_78a921ff) pero nunca integrada. Falta: confirmar nivel/dosis tras el cambio a escalera 1–10, 3–4 pasos para posturas y video público.',
        'progression': PROG_ENT,
    })
    cards.append(c)

def est(reps=None, sec=None, sets=1, per_side=False, rest=0, rps=3):
    work = (reps * rps if reps else sec) * (2 if per_side else 1)
    return int(work * sets + rest * (sets - 1) + 10)

def new(id, name, short, groups, level, dose, steps, cues, easier, harder, care, contra, prog, locations=('casa', 'oficina', 'parque', 'aula'), equipment=('ninguno',), impact='bajo', noise='silencioso', mayores=None, breath=None):
    t, n, sets, ps, rest, tempo = dose
    d = {'type': t, 'reps': n if t == 'reps' else None, 'durationSec': n if t != 'reps' else None, 'sets': sets, 'restSec': rest,
         'tempo': tempo, 'perSide': ps, 'estimatedSec': est(reps=n if t == 'reps' else None, sec=n if t != 'reps' else None, sets=sets, per_side=ps, rest=rest, rps=4 if tempo and tempo.startswith(('3', '4')) else 3)}
    if d['estimatedSec'] > 120: print('LARGA', id, d['estimatedSec'])
    assert all(len(s) <= 90 for s in steps), id
    c = {'id': id, 'version': 1, 'draft': True, 'published': False, 'status': 'draft', 'origin': 'codelius-propuesta-2026-10-17',
         'draftNote': 'Propuesta de Codelius sin validar: Entrenador debe confirmar nivel, dosis, pasos, contraindicaciones y aportar fuente + video.',
         'name': name, 'shortName': short, 'muscleGroups': list(groups), 'primaryGroup': groups[0], 'level': level, 'dose': d,
         'locations': list(locations), 'equipment': list(equipment), 'impact': impact, 'noise': noise, 'steps': steps, 'cues': cues,
         'easier': easier, 'harder': harder, 'careZones': care, 'contraindications': contra, 'progression': prog,
         'decks': ['adulto-general'], 'demographicNotes': {'mayores': mayores, 'ninos': None}, 'sprite': None, 'sfx': None, 'flavorText': None,
         'sources': [], 'reviewedBy': None, 'reviewedAt': None, 'license': 'CC-BY-4.0'}
    if breath: c['breath'] = breath
    cards.append(c)

STOP = 'Detente si hay dolor agudo, mareo o falta de aire anormal.'
# ---------- PIERNAS ----------
new('zancada-alterna-l4', 'Zancada frontal alterna', 'Zancada alterna', ['piernas', 'gluteos'], 4, ('reps', 6, 2, True, 20, '2-0-1'),
    ['De pie, pies al ancho de cadera y manos en la cintura.', 'Da un paso largo al frente y baja hasta que ambas rodillas formen 90°.',
     'Empuja con el talón de adelante y vuelve a juntar los pies.', 'Repite con la otra pierna, alternando.'],
    ['Rodilla de adelante sobre el tobillo', 'Tronco erguido'], 'zancada-trasera-l3', 'sentadilla-bulgara-l5', ['rodilla', 'equilibrio'],
    ['Dolor de rodilla al frenar: vuelve a la zancada trasera. ' + STOP], 'Pasa a la búlgara cuando hagas 2×6 por lado sin perder el equilibrio ni dolor en 3 días distintos.', mayores='Con apoyo de una mano en la pared.')
new('sentadilla-bulgara-l5', 'Sentadilla búlgara', 'Búlgara', ['piernas', 'gluteos'], 5, ('reps', 6, 2, True, 20, '2-1-1'),
    ['De espaldas a una silla firme, apoya el empeine de un pie en el asiento.', 'Adelanta el otro pie hasta que la rodilla quede sobre el tobillo.',
     'Baja recto hasta que el muslo de adelante quede casi paralelo al piso.', 'Empuja con el talón para subir; termina el lado y cambia.'],
    ['Peso en la pierna de adelante', 'Cadera cuadrada al frente'], 'zancada-alterna-l4', 'sentadilla-pistol-silla-l6', ['rodilla', 'equilibrio'],
    ['Silla que se mueve: no usar, pon la silla contra la pared. Dolor de rodilla: reduce la profundidad. ' + STOP],
    'Pasa a la pistol a la silla cuando hagas 2×6 por lado con pausa de 1 s abajo, sin dolor, en 3 días distintos.', equipment=['silla'], locations=['casa', 'oficina', 'aula'])
new('sentadilla-pistol-silla-l6', 'Sentadilla a una pierna a la silla', 'Pistol a silla', ['piernas', 'gluteos'], 6, ('reps', 5, 2, True, 30, '3-0-1'),
    ['Siéntate al borde de una silla firme con un pie apoyado y el otro estirado al frente.', 'Inclina el tronco y levántate solo con la pierna apoyada.',
     'Baja en 3 s hasta rozar el asiento sin dejarte caer.', 'Repite y luego cambia de pierna.'],
    ['Rodilla alineada con el segundo dedo', 'Brazos al frente para equilibrar'], 'sentadilla-bulgara-l5', None, ['rodilla', 'equilibrio'],
    ['Si no puedes bajar controlado, ayúdate con una mano en la pared. ' + STOP],
    'Cierra Adepto cuando hagas 2×5 por lado sin manos y sin dejarte caer; siguiente paso (Magister): pistol con asiento más bajo.', equipment=['silla'], locations=['casa', 'oficina', 'aula'], mayores='No recomendada sin supervisión.')
# ---------- GLUTEOS ----------
new('puente-hombros-elevados-l4', 'Puente con hombros elevados', 'Puente elevado', ['gluteos', 'piernas'], 4, ('reps', 12, 2, False, 20, '2-1-1'),
    ['Apoya la parte alta de la espalda en el borde de un sofá o banca firme.', 'Pies al ancho de cadera, rodillas dobladas a 90° al subir.',
     'Empuja con los talones y sube la cadera hasta alinearla con hombros y rodillas.', 'Aprieta glúteos 1 s arriba y baja controlado.'],
    ['Mentón recogido', 'Costillas abajo, sin arquear la lumbar'], 'puente-gluteo-una-pierna-l3', 'puente-una-pierna-elevado-l5', ['lumbar'],
    ['Dolor lumbar al subir: reduce la altura y vuelve al puente en el piso. ' + STOP],
    'Pasa a una pierna cuando hagas 2×12 con pausa arriba y sin molestia lumbar en 3 días distintos.', equipment=['banca-parque'], locations=['casa', 'parque'])
new('puente-una-pierna-elevado-l5', 'Puente a una pierna con hombros elevados', 'Puente 1 pierna', ['gluteos', 'piernas'], 5, ('reps', 6, 2, True, 20, '2-1-1'),
    ['Espalda alta en el borde de un sofá o banca firme y pies apoyados.', 'Levanta un pie y estira esa pierna o dobla la rodilla al pecho.',
     'Empuja con el talón apoyado hasta alinear la cadera.', 'Pausa 1 s, baja controlado; termina el lado y cambia.'],
    ['Cadera nivelada, sin girar', 'Empuja con el talón'], 'puente-hombros-elevados-l4', 'peso-muerto-una-pierna-l6', ['lumbar', 'cadera'],
    ['Si la cadera se tuerce o duele la lumbar: vuelve a la versión con dos pies. ' + STOP],
    'Pasa al peso muerto a una pierna cuando hagas 2×6 por lado con la cadera nivelada en 3 días distintos.', equipment=['banca-parque'], locations=['casa', 'parque'])
new('peso-muerto-una-pierna-l6', 'Peso muerto a una pierna', 'Peso muerto 1p', ['gluteos', 'piernas'], 6, ('reps', 5, 2, True, 20, '3-0-1'),
    ['De pie sobre una pierna, rodilla levemente flexionada.', 'Inclina el tronco al frente mientras la otra pierna sube estirada atrás.',
     'Baja hasta sentir el estiramiento atrás del muslo, espalda recta.', 'Vuelve arriba apretando el glúteo; termina el lado y cambia.'],
    ['Cadera y hombros en línea recta', 'Pelvis cuadrada al piso'], 'puente-una-pierna-elevado-l5', None, ['lumbar', 'equilibrio'],
    ['Pérdida de equilibrio: toca la pared con una mano. Dolor lumbar: reduce el rango. ' + STOP],
    'Cierra Adepto con 2×5 por lado sin apoyar el pie; siguiente paso (Magister): con pausa de 2 s abajo.', mayores='Con una mano en la pared.')
# ---------- EMPUJE ----------
new('flexion-tempo-l4', 'Flexión completa lenta', 'Flexión lenta', ['empuje', 'core'], 4, ('reps', 8, 2, False, 30, '3-1-1'),
    ['Manos bajo los hombros y cuerpo recto de la cabeza a los talones.', 'Baja en 3 s hasta que el pecho quede a un puño del piso.',
     'Pausa 1 s abajo sin apoyarte.', 'Empuja el piso y sube en 1 s.'],
    ['Codos a 45° del cuerpo', 'Glúteos y abdomen firmes'], 'flexion-completa-l3', 'flexion-declinada-l5', ['hombro', 'muneca'],
    ['Dolor de muñeca: apoya los puños o usa un borde elevado. Dolor de hombro: vuelve a la flexión de rodillas. ' + STOP],
    'Pasa a la declinada cuando hagas 2×8 lentas con el cuerpo recto en 3 días distintos.')
new('flexion-declinada-l5', 'Flexión declinada', 'Flexión declinada', ['empuje', 'core'], 5, ('reps', 8, 2, False, 30, '2-0-1'),
    ['Pies sobre una silla o escalón firme y manos en el piso bajo los hombros.', 'Cuerpo recto de la cabeza a los talones.',
     'Baja controlado hasta acercar el pecho al piso.', 'Empuja y sube sin hundir la cadera.'],
    ['Mira un poco adelante de las manos', 'No dejes caer la cadera'], 'flexion-tempo-l4', 'flexion-pike-elevada-l6', ['hombro', 'muneca'],
    ['Hipertensión no controlada: evita la cabeza abajo; usa la flexión lenta. ' + STOP],
    'Pasa a la pica elevada cuando hagas 2×8 con técnica limpia en 3 días distintos.', equipment=['silla', 'escalon'], locations=['casa', 'oficina', 'aula'])
cards[-1]['careZones'].append('hipertension')
new('flexion-pike-elevada-l6', 'Flexión pica con pies elevados', 'Pica elevada', ['empuje'], 6, ('reps', 6, 2, False, 30, '3-0-1'),
    ['Pies sobre una silla firme y manos en el piso, cadera alta en forma de V invertida.', 'Dobla los codos y baja la cabeza hacia el piso en 3 s.',
     'Toca suave con la coronilla o quédate a un puño del piso.', 'Empuja hasta estirar los brazos sin bajar la cadera.'],
    ['Cadera arriba de los hombros', 'Cabeza entre las manos, en triángulo'], 'flexion-declinada-l5', None, ['hombro', 'muneca', 'cuello', 'hipertension'],
    ['Hipertensión, glaucoma o mareo con la cabeza abajo: no hacerla. Dolor de hombro o cuello: vuelve a la pica en el piso. ' + STOP],
    'Cierra Adepto con 2×6 controladas; siguiente paso (Magister): flexión arquero.', equipment=['silla'], locations=['casa', 'oficina', 'aula'], mayores='No recomendada.')
# ---------- TRACCION ----------
new('remo-mesa-pausa-l4', 'Remo invertido con pausa', 'Remo con pausa', ['traccion', 'core'], 4, ('reps', 8, 2, False, 30, '2-2-1'),
    ['Acuéstate bajo una mesa muy firme y toma el borde con las manos al ancho de hombros.', 'Cuerpo recto, talones en el piso (o pies elevados si ya puedes).',
     'Tira del pecho hacia el borde juntando los omóplatos.', 'Sostén 2 s arriba y baja controlado.'],
    ['Pecho al borde, no el mentón', 'Hombros lejos de las orejas'], 'remo-mesa-alto-l3', 'dominada-isometrica-l5', ['hombro', 'lumbar'],
    ['Mesa que se mueve o cruje: no usar. Dolor de hombro: vuelve al remo con toalla. ' + STOP],
    'Pasa a la isométrica en barra cuando hagas 2×8 con 2 s arriba en 3 días distintos.', equipment=['mesa-firme'], locations=['casa', 'oficina'])
new('dominada-isometrica-l5', 'Dominada isométrica arriba', 'Dominada iso', ['traccion', 'empuje'], 5, ('hold', 8, 3, False, 30, None),
    ['Desde una banca o escalón, toma una barra del parque con las palmas al frente.', 'Sube con ayuda de los pies hasta que el mentón pase la barra.',
     'Quita los pies y sostén arriba 8 s con los hombros firmes.', 'Baja apoyando los pies; descansa y repite.'],
    ['Pecho hacia la barra', 'Codos pegados al cuerpo'], 'remo-mesa-pausa-l4', 'dominada-negativa-lenta-l6', ['hombro'],
    ['Dolor de hombro o codo al colgar: vuelve al remo invertido. Estructura inestable: no usar. ' + STOP],
    'Pasa a la negativa lenta cuando sostengas 3×8 s sin bajar el mentón en 3 días distintos.', equipment=['banca-parque'], locations=['parque'], noise='moderado', mayores='No recomendada.')
new('dominada-negativa-lenta-l6', 'Dominada negativa lenta', 'Negativa lenta', ['traccion', 'empuje'], 6, ('reps', 3, 3, False, 30, '6-0-1'),
    ['Desde una banca, sube con los pies hasta tener el mentón sobre la barra.', 'Quita los pies y baja en 6 s hasta estirar los brazos.',
     'Al final, cuelga 1 s con los hombros activos.', 'Apoya los pies y vuelve a subir para la siguiente.'],
    ['Cuenta 6 s en voz baja', 'Sin soltarte de golpe al final'], 'dominada-isometrica-l5', None, ['hombro'],
    ['Dolor de hombro o codo: vuelve a la isométrica. ' + STOP],
    'Cierra Adepto con 3×3 de 6 s; siguiente paso (Magister): primera dominada completa.', equipment=['banca-parque'], locations=['parque'], noise='moderado', mayores='No recomendada.')
# ---------- CORE ----------
new('plancha-toque-hombro-l4', 'Plancha con toque de hombro', 'Toque de hombro', ['core', 'empuje'], 4, ('reps', 6, 2, True, 20, '2-0-2'),
    ['Plancha alta: manos bajo los hombros y pies separados al ancho de cadera.', 'Levanta una mano y toca el hombro contrario.',
     'Regresa la mano al piso sin que la cadera gire.', 'Alterna lados de forma lenta.'],
    ['Cadera quieta, como si tuvieras un vaso en la espalda', 'Abdomen firme'], 'plancha-frontal-l2', 'hollow-agrupado-l5', ['muneca', 'hombro'],
    ['Dolor de muñeca: apoya las manos en un borde firme. ' + STOP],
    'Pasa al hollow agrupado cuando hagas 2×6 por lado sin girar la cadera en 3 días distintos.')
new('hollow-agrupado-l5', 'Hollow agrupado', 'Hollow agrupado', ['core'], 5, ('hold', 20, 2, False, 20, None),
    ['Boca arriba, rodillas al pecho y brazos junto al cuerpo.', 'Despega cabeza y hombros del piso y pega la lumbar al suelo.',
     'Lleva las rodillas sobre la cadera, piernas a 90°.', 'Sostén 20 s respirando; baja despacio.'],
    ['Lumbar pegada al piso todo el tiempo', 'Mentón recogido'], 'plancha-toque-hombro-l4', 'hollow-extendido-l6', ['lumbar', 'cuello'],
    ['Si la lumbar se despega o duele: acerca más las rodillas. Embarazo: no hacerla boca arriba. ' + STOP],
    'Pasa al hollow extendido cuando sostengas 2×20 s con la lumbar pegada en 3 días distintos.', locations=['casa', 'parque', 'aula'])
cards[-1]['careZones'].append('embarazo')
new('hollow-extendido-l6', 'Hollow extendido', 'Hollow', ['core'], 6, ('hold', 25, 2, False, 20, None),
    ['Boca arriba con brazos estirados sobre la cabeza y piernas juntas.', 'Despega hombros y piernas del piso a la vez.',
     'Forma una «banana»: lumbar pegada al suelo y piernas a 30° del piso.', 'Sostén 25 s; si la lumbar se despega, sube las piernas.'],
    ['Lumbar pegada', 'Costillas abajo'], 'hollow-agrupado-l5', None, ['lumbar', 'cuello', 'embarazo'],
    ['Si la lumbar se arquea: vuelve al hollow agrupado. Embarazo: no hacerla. ' + STOP],
    'Cierra Adepto con 2×25 s sin que se despegue la lumbar; siguiente paso (Magister): hollow con balanceo.', locations=['casa', 'parque', 'aula'])
# ---------- MOVILIDAD ----------
new('sentadilla-profunda-sostenida-l4', 'Sentadilla profunda sostenida', 'Sentadilla honda', ['movilidad', 'piernas'], 4, ('hold', 30, 2, False, 15, None),
    ['De pie, pies algo más abiertos que la cadera y puntas un poco hacia fuera.', 'Baja hasta el fondo con los talones apoyados.',
     'Junta las manos al pecho y empuja las rodillas hacia fuera con los codos.', 'Respira lento 30 s y sube despacio.'],
    ['Talones abajo (si se levantan, pon un libro debajo)', 'Pecho alto'], 'estiramiento-flexor-cadera-pie-l3', 'estiramiento-mundial-l5', ['rodilla', 'tobillo'],
    ['Dolor de rodilla en el fondo: baja solo hasta donde no duela o sujétate de un marco de puerta. ' + STOP],
    'Pasa al estiramiento mundial cuando sostengas 2×30 s con los talones abajo y sin molestia.', mayores='Sujetándose de un marco de puerta.')
new('estiramiento-mundial-l5', 'Estiramiento mundial', 'Estiramiento mundial', ['movilidad', 'gluteos'], 5, ('reps', 4, 1, True, 0, '3-2-1'),
    ['Da un paso largo al frente y apoya ambas manos en el piso por dentro del pie.', 'Baja el codo de ese lado hacia el tobillo.',
     'Gira el tronco y estira ese brazo hacia el techo, mirando la mano.', 'Vuelve, regresa el pie y repite con el otro lado.'],
    ['Pierna de atrás estirada', 'Gira desde el pecho, no desde el cuello'], 'sentadilla-profunda-sostenida-l4', 'sentadilla-cosaca-l6', ['rodilla', 'cadera', 'lumbar'],
    ['Dolor de cadera o espalda al girar: reduce el giro y apoya la rodilla de atrás. ' + STOP],
    'Pasa a la cosaca cuando hagas 4 por lado sin perder el equilibrio y con el brazo vertical.', mayores='Con la rodilla de atrás apoyada.')
new('sentadilla-cosaca-l6', 'Sentadilla cosaca asistida', 'Cosaca', ['movilidad', 'piernas'], 6, ('reps', 5, 2, True, 15, '3-1-1'),
    ['Pies muy separados y puntas un poco hacia fuera; si lo necesitas, manos en una silla.', 'Lleva el peso a una pierna y baja doblando esa rodilla.',
     'La otra pierna queda estirada con la punta hacia arriba.', 'Sube al centro y repite hacia el otro lado.'],
    ['Talón de la pierna doblada apoyado', 'Pecho alto'], 'estiramiento-mundial-l5', None, ['rodilla', 'cadera'],
    ['Dolor de rodilla o ingle: reduce la profundidad. ' + STOP],
    'Cierra Adepto con 2×5 por lado sin ayuda de las manos; siguiente paso (Magister): cosaca profunda sin apoyo.', mayores='Con la silla de apoyo.')
# ---------- CARDIO ----------
new('escalador-l4', 'Escalador', 'Escalador', ['cardio', 'core'], 4, ('time', 20, 2, False, 20, None),
    ['Plancha alta con manos bajo los hombros.', 'Lleva una rodilla al pecho y regrésala.', 'Alterna piernas a ritmo constante, como si corrieras.',
     'Mantén la cadera baja durante los 20 s.'],
    ['Hombros sobre las manos', 'Respira, no aguantes el aire'], 'escalador-lento-l2', 'patinador-l5', ['muneca', 'hombro', 'hipertension'],
    ['Hipertensión no controlada: usa el escalador lento. Dolor de muñeca: manos en un borde firme. ' + STOP],
    'Pasa al patinador cuando completes 2×20 s a ritmo constante y puedas hablar en frases cortas al terminar.', noise='moderado', impact='medio')
new('patinador-l5', 'Patinador', 'Patinador', ['cardio', 'piernas', 'gluteos'], 5, ('time', 20, 2, False, 20, None),
    ['De pie, rodillas suaves.', 'Salta de lado hacia la derecha y aterriza en un pie.', 'Cruza el otro pie por detrás sin apoyarlo y balancea los brazos.',
     'Salta hacia la izquierda y sigue alternando 20 s.'],
    ['Aterriza suave, rodilla sobre el pie', 'Sin ruido: si suena, salta menos'], 'escalador-l4', 'burpee-l6', ['rodilla', 'tobillo', 'equilibrio'],
    ['Dolor de rodilla o tobillo, o vecinos abajo: paso lateral sin salto. ' + STOP],
    'Pasa al burpee cuando completes 2×20 s con aterrizajes silenciosos y sin dolor.', locations=['casa', 'parque'], impact='alto', noise='moderado', mayores='Paso lateral sin salto.')
new('burpee-l6', 'Burpee', 'Burpee', ['cardio', 'empuje', 'piernas'], 6, ('reps', 6, 2, False, 30, None),
    ['De pie, baja en cuclillas y apoya las manos en el piso.', 'Lleva los pies atrás a plancha alta (salto o paso a paso).',
     'Regresa los pies junto a las manos.', 'Ponte de pie con un pequeño salto y brazos arriba.'],
    ['Plancha recta, sin hundir la cadera', 'Aterriza suave'], 'patinador-l5', None, ['rodilla', 'muneca', 'lumbar', 'hipertension'],
    ['Hipertensión no controlada o dolor lumbar: burpee sin salto y paso a paso. ' + STOP],
    'Cierra Adepto con 2×6 continuos; siguiente paso (Magister): burpee con flexión.', locations=['casa', 'parque'], impact='alto', noise='ruidoso', mayores='No recomendada; usar sentadilla a la silla + marcha.')

# enlaces hacia arriba desde la Entrega 1 (nivel 3 → Adepto)
UP = {'zancada-trasera-l3': 'zancada-alterna-l4', 'puente-gluteo-una-pierna-l3': 'puente-hombros-elevados-l4', 'flexion-completa-l3': 'flexion-tempo-l4',
      'remo-mesa-alto-l3': 'remo-mesa-pausa-l4', 'plancha-frontal-l2': 'plancha-toque-hombro-l4', 'estiramiento-flexor-cadera-pie-l3': 'sentadilla-profunda-sostenida-l4',
      'escalador-lento-l2': 'escalador-l4'}
byid = {c['id']: c for c in cards}
for a, b in UP.items():
    if byid[a].get('harder') in (None,): byid[a]['harder'] = b
    elif a == 'remo-mesa-alto-l3': pass  # ya apunta a dominada-negativa-l3
for c in cards: c['tier'] = tier(c['level'])
cards.sort(key=lambda c: (['piernas', 'gluteos', 'empuje', 'traccion', 'core', 'movilidad', 'cardio'].index(c['primaryGroup']), c['level'], c['id']))
json.dump(cards, open(out, 'w'), ensure_ascii=False, indent=2)
open(out, 'a').write('\n')
print(len(cards), 'cartas;', sum(c['level'] <= 3 for c in cards), 'Aprendiz;', sum(4 <= c['level'] <= 6 for c in cards), 'Adepto')
