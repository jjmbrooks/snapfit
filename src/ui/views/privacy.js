export function renderPrivacy() {
  return `
  <h2>Aviso de privacidad</h2>
  <article class="card">
    <p><b>Resumen.</b> SnapFit funciona sin cuenta: tu progreso se guarda en este dispositivo (IndexedDB). No usamos GPS, cámara ni micrófono.</p>
    <h3>Si entras con Google</h3>
    <p>Firebase Authentication recibe tu cuenta de Google para identificarte. Tus eventos de ejercicio (qué carta, cuándo, nivel, esfuerzo opcional) se respaldan en Cloud Firestore bajo tu identificador, protegidos por reglas para que solo tú los leas. No guardamos tu nombre ni correo en la base de datos de SnapFit.</p>
    <h3>Estadísticas anónimas (Google Analytics for Firebase)</h3>
    <p>Si las dejas activas, se envían solo estos eventos: <code>card_done</code>, <code>card_skip</code>, <code>level_up</code> y <code>theme_change</code>, con parámetros como nivel de carta, grupo muscular o tema. Sin texto libre, sin tu identificador de cuenta, sin señales de Google ni personalización de anuncios. Puedes desactivarlas en Menú → Preferencias.</p>
    <h3>Tus derechos</h3>
    <p>Puedes exportar tus datos (JSON/CSV), borrar los datos del dispositivo y borrar tu cuenta y datos en la nube desde el Menú.</p>
    <p>Edad mínima: 13 años. Responsable: jjmbrooks (Jhonatan Jesús Martínez Brooks).</p>
    <p class="small"><a href="https://github.com/jjmbrooks/snapfit/blob/main/docs/PRIVACY.md" target="_blank" rel="noopener">Aviso completo en GitHub</a></p>
  </article>`;
}
