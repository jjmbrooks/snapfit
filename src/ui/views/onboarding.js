import { esc } from '../dom.js';
import { PLACE_NAMES } from '../i18n/es.js';
import { PLACES } from '../../core/index.js';

export function showOnboarding(app) {
  const o = document.createElement('div');
  o.className = 'overlay onb';
  o.setAttribute('role', 'dialog');
  o.setAttribute('aria-modal', 'true');
  o.setAttribute('aria-labelledby', 'onb-t');
  o.innerHTML = `
    <form class="panel" style="text-align:left">
      <h1 id="onb-t" class="brand" style="text-align:center">SnapFit</h1>
      <p style="margin:0;text-align:center">Una carta. Un movimiento. <b>¡Listo!</b></p>
      <div class="notice">⚠ SnapFit da información general de actividad física y <b>no sustituye una valoración médica</b>. Si tienes lesión, dolor, enfermedad cardiovascular o embarazo, consulta a un profesional. Detente si sientes dolor agudo, mareo o falta de aire anormal.<br><br>Las cartas actuales son <b>borradores</b> pendientes de validación por nuestro entrenador.</div>
      <label class="check"><input type="checkbox" name="age" required> <span>Tengo 13 años o más y leí el aviso.</span></label>
      <div>
        <p class="small muted" style="margin:0 0 6px">¿Dónde sueles moverte? (opcional)</p>
        <div class="toggle-chips">${PLACES.map((p) => `<label><input type="checkbox" name="place" value="${p}"> ${esc(PLACE_NAMES[p])}</label>`).join('')}</div>
      </div>
      <label class="check small"><input type="checkbox" name="an" checked> <span>Enviar estadísticas anónimas de uso (<a href="#/privacidad" data-priv>detalles</a>).</span></label>
      <button class="btn btn-primary btn-big" type="submit">¡A jugar!</button>
    </form>`;
  document.body.appendChild(o);
  const f = o.querySelector('form');
  o.querySelector('[data-priv]').addEventListener('click', () => o.remove());
  f.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!f.age.checked) return;
    const places = [...f.querySelectorAll('input[name=place]:checked')].map((i) => i.value);
    o.remove();
    await app.finishOnboarding({ places, analytics: f.an.checked });
  });
}
