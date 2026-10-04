// Onboarding: bienvenida (historia) → Google → perfil (edad, sexo, condición + prueba rápida) → aviso breve → jugar.
import { esc, toast } from '../dom.js';
import { STORY, GROUP_NAMES, FAMILY_ICONS } from '../i18n/es.js';
import { QUICK_TEST, SEXES, FITNESS, MUSCLE_GROUPS, validateProfile } from '../../core/index.js';
import { mountSprite } from '../components/sprite.js';

const SEX_NAMES = { mujer: 'Mujer', hombre: 'Hombre', otro: 'Otro', 'prefiero-no-decir': 'Prefiero no decir' };
const FIT_NAMES = {
  sedentario: ['Sedentario', 'Casi no hago ejercicio'],
  ligero: ['Ligero', 'Camino o me muevo algo, 1–2 días por semana'],
  activo: ['Activo', 'Ejercicio 3–4 días por semana'],
  'muy-activo': ['Muy activo', 'Entreno 5 o más días por semana'],
};

const ui = { sub: 'story', draft: { test: {} }, part: 0, busy: false, error: null };

function dots(n, i) {
  return `<div class="onb-dots" aria-hidden="true">${Array.from({ length: n }, (_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</div>`;
}

export function renderOnboarding(app, step) {
  if (step === 'welcome') return ui.sub === 'signin' ? signinHTML(app) : storyHTML();
  if (step === 'profile') return profileHTML(app);
  if (step === 'terms') return termsHTML(app);
  return '';
}

function storyHTML() {
  return `
  <section class="onb-screen onb-story">
    ${dots(4, 0)}
    <div class="onb-hero">
      <div class="hero-cards" aria-hidden="true">
        <div class="mini-card fam-piernas"><canvas data-hero="squat"></canvas></div>
        <div class="mini-card fam-core"><canvas data-hero="jacks"></canvas></div>
        <div class="mini-card fam-empuje"><canvas data-hero="pushup-wall"></canvas></div>
      </div>
      <h1 class="logo">SnapFit</h1>
      <p class="onb-sub">${esc(STORY.title)}</p>
    </div>
    <div class="story">${STORY.lines.map((l, i) => `<p style="animation-delay:${i * 0.5}s">${esc(l)}</p>`).join('')}</div>
    <button class="btn btn-primary btn-xl" data-onb="to-signin">${esc(STORY.cta)} ▶</button>
    <p class="small muted center">Historia provisional · el mundo final lo escribe storyteller.</p>
  </section>`;
}

function signinHTML(app) {
  const online = app.state.online;
  return `
  <section class="onb-screen">
    ${dots(4, 1)}
    <h2 class="onb-title">Crea tu héroe</h2>
    <p>Entra con tu cuenta de Google para guardar tu mazo, tu nivel y tus logros, y recuperarlos en cualquier teléfono.</p>
    <p class="small muted">Después del primer inicio de sesión, SnapFit funciona también <b>sin internet</b>.</p>
    ${ui.error ? `<p class="form-error" role="alert">${esc(ui.error)}</p>` : ''}
    <button class="btn btn-google btn-xl" data-onb="google" ${online && !ui.busy ? '' : 'disabled'}>
      <span class="g-logo" aria-hidden="true">G</span> ${ui.busy ? 'Conectando…' : 'Entrar con Google'}
    </button>
    ${online ? '' : '<p class="form-error">Necesitas conexión para el primer inicio de sesión.</p>'}
    <button class="btn btn-ghost" data-onb="back-story">◀ Volver</button>
    <p class="small muted center"><a href="#/privacidad">Aviso de privacidad</a></p>
  </section>`;
}

function profileHTML(app) {
  const d = ui.draft;
  const parts = [
    () => `
      <h2 class="onb-title">Sobre ti</h2>
      <label class="field"><span>Edad</span><input type="number" inputmode="numeric" min="13" max="100" id="age" value="${d.age ?? ''}" placeholder="Ej. 30"></label>
      <p class="small muted">Debes tener 13 años o más.</p>
      <fieldset class="opts"><legend>Sexo</legend>${SEXES.map((x) => `<label><input type="radio" name="sex" value="${x}" ${d.sex === x ? 'checked' : ''}><span>${SEX_NAMES[x]}</span></label>`).join('')}</fieldset>
      <p class="small muted">Lo usamos para elegir tu mazo cuando haya ajustes basados en evidencia.</p>`,
    () => `
      <h2 class="onb-title">Tu condición física</h2>
      <div class="choice-list">${FITNESS.map((x) => `<label class="choice"><input type="radio" name="fitness" value="${x}" ${d.fitness === x ? 'checked' : ''}><span><b>${FIT_NAMES[x][0]}</b><small>${FIT_NAMES[x][1]}</small></span></label>`).join('')}</div>`,
    () => `
      <h2 class="onb-title">Prueba rápida</h2>
      <p class="small muted">Responde con honestidad: no hace falta hacerlo ahora. Sirve para elegir tu nivel inicial.</p>
      ${QUICK_TEST.map((q) => `
        <fieldset class="opts test"><legend>${esc(q.question)}</legend>
          ${q.options.map((o, i) => `<label><input type="radio" name="t-${q.id}" value="${i}" ${d.test?.[q.id] === i ? 'checked' : ''}><span>${esc(o)}</span></label>`).join('')}
        </fieldset>`).join('')}`,
    () => {
      const prev = app.previewPlayer(d);
      return `
      <h2 class="onb-title">Tu mazo está listo</h2>
      <p>Mazo: <b>${esc(prev.deckId === 'adulto-general' ? 'Adulto general' : prev.deckId)}</b></p>
      <p class="small muted">${esc(prev.deckReason)}</p>
      <div class="lvl-grid">${MUSCLE_GROUPS.map((g) => `<div class="lvl-chip fam-${g}"><span>${FAMILY_ICONS[g]} ${esc(GROUP_NAMES[g])}</span><b>Nv ${prev.baseLevels[g]}</b></div>`).join('')}</div>
      <p class="small muted">El nivel se ajusta solo con tu progreso. Reglas provisionales hasta la validación de Entrenador.</p>`;
    },
  ];
  return `
  <section class="onb-screen">
    ${dots(4, 2)}
    <form id="pf" novalidate>
      ${parts[ui.part]()}
      ${ui.error ? `<p class="form-error" role="alert">${esc(ui.error)}</p>` : ''}
      <div class="onb-nav">
        ${ui.part > 0 ? '<button type="button" class="btn btn-ghost" data-onb="prev">◀ Atrás</button>' : '<span></span>'}
        <button type="submit" class="btn btn-primary">${ui.part === parts.length - 1 ? 'Confirmar ▶' : 'Siguiente ▶'}</button>
      </div>
    </form>
  </section>`;
}

function termsHTML(app) {
  return `
  <section class="onb-screen">
    ${dots(4, 3)}
    <h2 class="onb-title">Antes de jugar</h2>
    <div class="notice">⚠ SnapFit da información general de actividad física y <b>no sustituye una valoración médica</b>. Si tienes una lesión, dolor, una enfermedad cardiovascular o un embarazo, consulta a un profesional. Detente si sientes dolor agudo, mareo o falta de aire anormal.</div>
    <p class="small muted">Las cartas actuales son <b>borradores</b> pendientes de validación por nuestro entrenador.</p>
    <form id="tf">
      <label class="check"><input type="checkbox" name="ok" required> <span>Leí el aviso de salud y el <a href="#/privacidad">aviso de privacidad</a>.</span></label>
      <label class="check small"><input type="checkbox" name="an" ${app.state.profile.analytics ? 'checked' : ''}> <span>Enviar estadísticas anónimas de uso (sin datos personales).</span></label>
      ${ui.error ? `<p class="form-error" role="alert">${esc(ui.error)}</p>` : ''}
      <button class="btn btn-primary btn-xl" type="submit">¡A jugar! ▶</button>
    </form>
  </section>`;
}

function readPart(form) {
  const d = ui.draft;
  if (ui.part === 0) {
    const age = Number(form.querySelector('#age')?.value);
    d.age = Number.isInteger(age) ? age : undefined;
    d.sex = form.querySelector('input[name=sex]:checked')?.value;
    if (!(d.age >= 13 && d.age <= 100)) return 'Escribe tu edad (13 a 100 años).';
    if (!d.sex) return 'Elige una opción de sexo.';
  } else if (ui.part === 1) {
    d.fitness = form.querySelector('input[name=fitness]:checked')?.value;
    if (!d.fitness) return 'Elige tu condición física.';
  } else if (ui.part === 2) {
    d.test = {};
    for (const q of QUICK_TEST) {
      const v = form.querySelector(`input[name=t-${q.id}]:checked`)?.value;
      if (v != null) d.test[q.id] = Number(v);
    }
    if (QUICK_TEST.some((q) => d.test[q.id] == null)) return 'Responde las tres preguntas.';
  }
  return null;
}

export function bindOnboarding(root, app, step, deps, rerender) {
  const stops = [];
  root.querySelectorAll('canvas[data-hero]').forEach((c) => stops.push(mountSprite(c, { procedural: c.dataset.hero }, { reducedMotion: app.state.profile.reducedMotion })));
  if (step === 'profile' && app.state.profile.player && !ui.draft.age) ui.draft = { ...app.state.profile.player, test: { ...app.state.profile.player.test } };

  root.addEventListener('click', async (ev) => {
    const b = ev.target.closest('[data-onb]');
    if (!b) return;
    const a = b.dataset.onb;
    ui.error = null;
    if (a === 'to-signin') { ui.sub = 'signin'; rerender(); }
    else if (a === 'back-story') { ui.sub = 'story'; rerender(); }
    else if (a === 'prev') { ui.part = Math.max(0, ui.part - 1); rerender(); }
    else if (a === 'google') {
      ui.busy = true; rerender();
      try {
        await deps.signIn();
      } catch (e) {
        ui.error = e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request'
          ? 'Cerraste la ventana de Google. Inténtalo de nuevo.'
          : `No se pudo iniciar sesión (${e?.code || e?.message || e}).`;
      }
      ui.busy = false; rerender();
    }
  });
  root.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    ui.error = null;
    const form = ev.target;
    if (form.id === 'pf') {
      const err = readPart(form);
      if (err) { ui.error = err; return rerender(); }
      if (ui.part < 3) { ui.part++; return rerender(); }
      const { age, sex, fitness, test } = ui.draft;
      const v = validateProfile({ age, sex, fitness, test });
      if (v) { ui.error = v; return rerender(); }
      await app.setPlayer({ age, sex, fitness, test });
      ui.part = 0;
      if (location.hash.startsWith('#/perfil')) { toast('Perfil actualizado', 'Tu mazo y niveles iniciales se recalcularon.'); location.hash = '#/menu'; }
    } else if (form.id === 'tf') {
      if (!form.ok.checked) { ui.error = 'Marca la casilla para continuar.'; return rerender(); }
      await app.acceptTerms({ analytics: form.an.checked });
    }
  });
  return () => stops.forEach((s) => s());
}

/** Para «Editar perfil» desde el menú. */
export function startProfileEdit() { ui.part = 0; ui.draft = { test: {} }; }
