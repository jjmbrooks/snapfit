# Aviso de privacidad de SnapFit

**Última actualización:** 3 de octubre de 2026
**Responsable:** jjmbrooks (Jhonatan Jesús Martínez Brooks), La Unión, Guerrero, México. Contacto: a través de https://github.com/jjmbrooks/snapfit/issues

SnapFit es una aplicación web progresiva (PWA) gratuita y de código abierto para hacer microsesiones de ejercicio. Este aviso explica qué datos se tratan, para qué y cómo puedes controlarlos.

## 1. Datos en tu dispositivo

- Tu progreso (cartas hechas, saltadas, esfuerzo opcional, preferencias) y tu perfil de juego se guardan en tu dispositivo (IndexedDB del navegador), y la app funciona sin internet después del primer inicio de sesión.
- No se usan GPS, cámara, micrófono, contactos ni fotos.
- No se pide fecha de nacimiento.

## 2. Cuenta de Google (obligatoria la primera vez)

Para empezar a jugar entras con Google una vez. Después, SnapFit funciona aunque no tengas conexión.

| Dato | Servicio | Finalidad |
|------|----------|-----------|
| Identificador de cuenta (uid), nombre y correo de Google | Firebase Authentication (Google) | Identificarte y mostrar con qué cuenta entraste. SnapFit **no copia** tu nombre ni correo a su base de datos |
| Perfil de juego: edad en años, sexo, condición física, respuestas de la prueba rápida, mazo asignado, niveles iniciales y fecha de aceptación del aviso | Tu dispositivo y Cloud Firestore `users/{uid}.profile` | Elegir tu mazo y tu nivel inicial, y recuperarlos en otro teléfono. Puedes cambiarlo en Menú → Mi perfil |
| Eventos de ejercicio: id, tipo (`card_done`, `card_skipped`, `effort_rated`), fecha y hora, desfase horario, id de carta, nivel, grupos musculares, esfuerzo opcional, lugar elegido | Cloud Firestore (región `nam5`, EE. UU.) en `users/{uid}/events` | Respaldar tu progreso y sincronizarlo entre tus dispositivos |
| Resumen derivado (XP, niveles, racha, insignias) | Cloud Firestore `users/{uid}` | Caché del progreso |
| Ajustes: historia elegida (id) y tema | Tu dispositivo y Cloud Firestore `users/{uid}.settings` | Mantener tu historia y tu tema en todos tus teléfonos |

El perfil **no se envía a Analytics** (las estadísticas anónimas solo usan una lista cerrada de eventos sin datos personales).

Las reglas de seguridad de Firestore (`firestore.rules`) permiten que **solo tu cuenta** lea y escriba tus datos.

## 3. Estadísticas anónimas de uso (Google Analytics for Firebase)

Activadas por defecto (puedes desactivarlas en el onboarding o en **Menú → Preferencias → Estadísticas anónimas de uso**). Si están activas, la app envía **solo** estos eventos:

| Evento | Parámetros |
|--------|------------|
| `card_done` | `card_level` (número), `muscle_group` (p. ej. «piernas») |
| `card_skip` | `card_level`, `muscle_group` |
| `level_up` | `muscle_group`, `level` |
| `theme_change` | `theme` (p. ej. «selva») |

Medidas de minimización:

- Sin texto libre, sin identificador de cuenta (uid) ni propiedades de usuario propias. Solo queda el identificador de instancia que Firebase asigna por defecto.
- `allow_google_signals: false` y `allow_ad_personalization_signals: false` (sin señales de Google ni anuncios personalizados). No se envían vistas de página automáticas.
- El SDK de Analytics se carga de forma diferida, solo después del onboarding y con conexión.
- Google procesa estos datos según sus propios términos: https://policies.google.com/privacy

## 4. Recordatorios

Las preferencias de recordatorio (mañana, tarde, noche o personalizado) se guardan **solo en tu dispositivo**. Las notificaciones son **locales**: no hay servidor de push en esta versión.

## 5. Tus derechos y controles

- **Exportar:** Menú → Exportar JSON o CSV.
- **Borrar datos del dispositivo:** Menú → Zona de peligro.
- **Borrar cuenta y datos en la nube:** Menú → Zona de peligro (borra `users/{uid}/**` y tu usuario de Firebase Auth).
- **Desactivar estadísticas:** Menú → Preferencias.
- Para ejercer tus derechos ARCO (Ley Federal de Protección de Datos Personales en Posesión de los Particulares) o resolver dudas, abre un *issue* en el repositorio o contacta al responsable.

## 6. Menores de edad

SnapFit está dirigido a personas de **13 años o más**. Los futuros mazos infantiles se usarán bajo la cuenta de una persona adulta, sin perfiles de menores.

## 7. Salud

SnapFit ofrece información general de actividad física y **no sustituye una valoración médica**. No recopilamos datos médicos.

## 8. Cambios

Los cambios a este aviso se publicarán en este archivo y en el historial del repositorio.
