// Onboarding: bienvenida (historia) → Google → perfil (edad, sexo, condición + prueba rápida) → aviso breve → jugar.
import { esc, toast } from '../dom.js';
import { STORY, FAMILY_NAMES, FAMILY_ICONS, SEX_NAMES, FITNESS_NAMES, QUICK_TEST_COPY, t } from '../i18n/es.js';
import { QUICK_TEST, SEXES, FITNESS, MUSCLE_GROUPS, validateProfile } from '../../core/index.js';
import { mountSprite } from '../components/sprite.js';


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
    <p class="small muted center">${esc(STORY.note || '')}</p>
  </section>`;
}

function signinHTML(app) {
  const online = app.state.online;
  return `
  <section class="onb-screen">
    ${dots(4, 1)}
    <h2 class="onb-title">${esc(STORY.signin.title)}</h2>
    <p>${esc(STORY.signin.body)}</p>
    <p class="small muted">${STORY.signin.offline}</p>
    ${ui.error ? `<p class="form-error" role="alert">${esc(ui.error)}</p>` : ''}
    <button class="btn btn-google btn-xl" data-onb="google" ${online && !ui.busy ? '' : 'disabled'}>
      <span class="g-logo" aria-hidden="true">G</span> ${ui.busy ? t('onboarding.googleBusy') : t('onboarding.googleButton')}
    </button>
    ${online ? '' : `<p class="form-error">${t('onboarding.needOnline')}</p>`}
    <button class="btn btn-ghost" data-onb="back-story">${t('onboarding.back')}</button>
    <p class="small muted center"><a href="#/privacidad">${t('onboarding.privacyLink')}</a></p>
  </section>`;
}

function profileHTML(app) {
  const d = ui.draft;
  const parts = [
    () => `
      <h2 class="onb-title">${t('onboarding.aboutTitle')}</h2>
      <label class="field"><span>${t('onboarding.ageLabel')}</span><input type="number" inputmode="numeric" min="13" max="100" id="age" value="${d.age ?? ''}" placeholder="${t('onboarding.agePlaceholder')}"></label>
      <p class="small muted">${t('onboarding.ageHint')}</p>
      <fieldset class="opts"><legend>${t('onboarding.sexLegend')}</legend>${SEXES.map((x) => `<label><input type="radio" name="sex" value="${x}" ${d.sex === x ? 'checked' : ''}><span>${esc(SEX_NAMES[x])}</span></label>`).join('')}</fieldset>
      <p class="small muted">${t('onboarding.sexHint')}</p>`,
    () => `
      <h2 class="onb-title">${t('onboarding.fitnessTitle')}</h2>
      <div class="choice-list">${FITNESS.map((x) => `<label class="choice"><input type="radio" name="fitness" value="${x}" ${d.fitness === x ? 'checked' : ''}><span><b>${esc(FITNESS_NAMES[x].name)}</b><small>${esc(FITNESS_NAMES[x].desc)}</small></span></label>`).join('')}</div>`,
    () => `
      <h2 class="onb-title">${t('onboarding.testTitle')}</h2>
      <p class="small muted">${t('onboarding.testHint')}</p>
      ${QUICK_TEST.map((q) => `
        <fieldset class="opts test"><legend>${esc(QUICK_TEST_COPY[q.id].question)}</legend>
          ${QUICK_TEST_COPY[q.id].options.map((o, i) => `<label><input type="radio" name="t-${q.id}" value="${i}" ${d.test?.[q.id] === i ? 'checked' : ''}><span>${esc(o)}</span></label>`).join('')}
        </fieldset>`).join('')}`,
    () => {
      const prev = app.previewPlayer(d);
      return `
      <h2 class="onb-title">${esc(STORY.deckReady.title)}</h2>
      <p>${t('onboarding.deckLabel')} <b>${esc(t('onboarding.deckNames.' + prev.deckId))}</b></p>
      <p class="small muted">${esc(prev.deckReason)}</p>
      <div class="lvl-grid">${MUSCLE_GROUPS.map((g) => `<div class="lvl-chip fam-${g}"><span>${FAMILY_ICONS[g]} ${esc(FAMILY_NAMES[g])}</span><b>${t('onboarding.levelChip', { n: prev.baseLevels[g] })}</b></div>`).join('')}</div>
      <p class="small muted">${t('onboarding.levelsHint')}</p>`;
    },
  ];
  return `
  <section class="onb-screen">
    ${dots(4, 2)}
    <form id="pf" novalidate>
      ${parts[ui.part]()}
      ${ui.error ? `<p class="form-error" role="alert">${esc(ui.error)}</p>` : ''}
      <div class="onb-nav">
        ${ui.part > 0 ? `<button type="button" class="btn btn-ghost" data-onb="prev">${t('onboarding.prev')}</button>` : '<span></span>'}
        <button type="submit" class="btn btn-primary">${ui.part === parts.length - 1 ? t('onboarding.confirm') : t('onboarding.next')}</button>
      </div>
    </form>
  </section>`;
}

function termsHTML(app) {
  return `
  <section class="onb-screen">
    ${dots(4, 3)}
    <h2 class="onb-title">${t('onboarding.termsTitle')}</h2>
    <div class="notice">${t('onboarding.termsNotice')}</div>
    <p class="small muted">${t('onboarding.termsDraft')}</p>
    <form id="tf">
      <label class="check"><input type="checkbox" name="ok" required> <span>${t('onboarding.termsCheck')}</span></label>
      <label class="check small"><input type="checkbox" name="an" ${app.state.profile.analytics ? 'checked' : ''}> <span>${t('onboarding.analyticsCheck')}</span></label>
      ${ui.error ? `<p class="form-error" role="alert">${esc(ui.error)}</p>` : ''}
      <button class="btn btn-primary btn-xl" type="submit">${t('onboarding.play')}</button>
    </form>
  </section>`;
}

function readPart(form) {
  const d = ui.draft;
  if (ui.part === 0) {
    const age = Number(form.querySelector('#age')?.value);
    d.age = Number.isInteger(age) ? age : undefined;
    d.sex = form.querySelector('input[name=sex]:checked')?.value;
    if (!(d.age >= 13 && d.age <= 100)) return t('onboarding.errAge');
    if (!d.sex) return t('onboarding.errSex');
  } else if (ui.part === 1) {
    d.fitness = form.querySelector('input[name=fitness]:checked')?.value;
    if (!d.fitness) return t('onboarding.errFitness');
  } else if (ui.part === 2) {
    d.test = {};
    for (const q of QUICK_TEST) {
      const v = form.querySelector(`input[name=t-${q.id}]:checked`)?.value;
      if (v != null) d.test[q.id] = Number(v);
    }
    if (QUICK_TEST.some((q) => d.test[q.id] == null)) return t('onboarding.errTest');
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
          ? t('onboarding.popupClosed')
          : t('onboarding.signinError', { code: e?.code || e?.message || e });
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
      if (location.hash.startsWith('#/perfil')) { toast(t('onboarding.profileUpdated'), t('onboarding.profileUpdatedBody')); location.hash = '#/menu'; }
    } else if (form.id === 'tf') {
      if (!form.ok.checked) { ui.error = t('onboarding.termsRequired'); return rerender(); }
      await app.acceptTerms({ analytics: form.an.checked });
    }
  });
  return () => stops.forEach((s) => s());
}

/** Para «Editar perfil» desde el menú. */
export function startProfileEdit() { ui.part = 0; ui.draft = { test: {} }; }
