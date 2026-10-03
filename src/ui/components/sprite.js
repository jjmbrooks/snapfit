// Animaciones pixel-art PLACEHOLDER generadas por código (Codelius). Sin assets externos.
// Se reemplazan por los sprite sheets de director-creativo (Kanban t_7db959be).
// Lienzo lógico 32×32; figura de palitos con articulaciones interpoladas entre keyframes.

const S = 32;
const GROUND = 30;

// Atajo: pose lateral (ambos lados casi iguales, desfase de 1 px).
const side = (head, sh, hip, e, h, k, f) => ({
  head, sh, hip, eL: e, hL: h, eR: [e[0] - 1, e[1]], hR: [h[0] - 1, h[1]], kL: k, fL: f, kR: [k[0] - 1, k[1]], fR: [f[0] - 1, f[1]],
});
const front = (o) => ({ head: [16, 6], sh: [16, 10], hip: [16, 18], ...o });
const STAND_F = front({ eL: [13, 13], hL: [12, 17], eR: [19, 13], hR: [20, 17], kL: [14, 24], fL: [14, 30], kR: [18, 24], fR: [18, 30] });

export const ANIMS = {
  squat: [
    side([17, 6], [17, 10], [17, 18], [20, 13], [23, 13], [17, 24], [17, 30]),
    side([15, 12], [15, 16], [11, 22], [18, 17], [22, 16], [17, 24], [17, 30]),
  ],
  'pushup-wall': [
    side([20, 7], [19, 11], [15, 19], [22, 11], [26, 11], [13, 24], [11, 30]),
    side([22, 9], [21, 13], [16, 20], [22, 15], [26, 11], [13, 25], [11, 30]),
  ],
  'pushup-incline': [
    side([23, 12], [21, 14], [12, 20], [23, 17], [25, 20], [7, 25], [3, 30]),
    side([24, 16], [22, 18], [12, 22], [21, 21], [25, 20], [7, 26], [3, 30]),
  ],
  bridge: [
    side([5, 27], [8, 28], [15, 28], [11, 29], [13, 29], [19, 23], [22, 30]),
    side([5, 27], [8, 28], [15, 23], [11, 29], [13, 29], [20, 22], [22, 30]),
  ],
  march: [
    front({ eL: [13, 13], hL: [13, 9], eR: [19, 13], hR: [20, 17], kL: [14, 20], fL: [14, 25], kR: [18, 24], fR: [18, 30] }),
    front({ eL: [13, 13], hL: [12, 17], eR: [19, 13], hR: [19, 9], kL: [14, 24], fL: [14, 30], kR: [18, 20], fR: [18, 25] }),
  ],
  calf: [STAND_F, shift(STAND_F, -2, ['fL', 'fR'])],
  row: [
    side([16, 6], [16, 10], [16, 18], [20, 13], [24, 13], [16, 24], [16, 30]),
    side([16, 6], [16, 10], [16, 18], [12, 13], [17, 13], [16, 24], [16, 30]),
  ],
  birddog: [
    { head: [25, 16], sh: [22, 18], hip: [11, 19], eL: [22, 23], hL: [22, 28], eR: [21, 23], hR: [21, 28], kL: [11, 28], fL: [5, 28], kR: [10, 28], fR: [4, 28] },
    { head: [25, 16], sh: [22, 18], hip: [11, 19], eL: [22, 23], hL: [22, 28], eR: [26, 17], hR: [30, 16], kL: [11, 28], fL: [5, 28], kR: [5, 19], fR: [1, 18] },
  ],
  plank: [
    { head: [26, 20], sh: [22, 22], hip: [13, 24], eL: [22, 28], hL: [27, 28], eR: [21, 28], hR: [26, 28], kL: [6, 28], fL: [2, 25], kR: [6, 28], fR: [2, 25] },
    { head: [26, 21], sh: [22, 23], hip: [13, 25], eL: [22, 28], hL: [27, 28], eR: [21, 28], hR: [26, 28], kL: [6, 28], fL: [2, 25], kR: [6, 28], fR: [2, 25] },
  ],
  arms: [
    front({ eL: [11, 10], hL: [6, 10], eR: [21, 10], hR: [26, 10], kL: [14, 24], fL: [14, 30], kR: [18, 24], fR: [18, 30] }),
    front({ eL: [11, 8], hL: [6, 7], eR: [21, 8], hR: [26, 7], kL: [14, 24], fL: [14, 30], kR: [18, 24], fR: [18, 30] }),
    front({ eL: [11, 10], hL: [6, 10], eR: [21, 10], hR: [26, 10], kL: [14, 24], fL: [14, 30], kR: [18, 24], fR: [18, 30] }),
    front({ eL: [11, 12], hL: [6, 13], eR: [21, 12], hR: [26, 13], kL: [14, 24], fL: [14, 30], kR: [18, 24], fR: [18, 30] }),
  ],
  jacks: [
    STAND_F,
    front({ eL: [12, 7], hL: [10, 3], eR: [20, 7], hR: [22, 3], kL: [11, 24], fL: [8, 30], kR: [18, 24], fR: [18, 30] }),
    STAND_F,
    front({ eL: [12, 7], hL: [10, 3], eR: [20, 7], hR: [22, 3], kL: [14, 24], fL: [14, 30], kR: [21, 24], fR: [24, 30] }),
  ],
  lunge: [
    side([16, 6], [16, 10], [16, 18], [15, 14], [15, 18], [17, 24], [17, 30]),
    side([15, 10], [15, 14], [15, 21], [14, 17], [14, 21], [20, 24], [21, 30]),
  ],
};
// En zancada la pierna trasera va atrás.
ANIMS.lunge[1].kR = [11, 28];
ANIMS.lunge[1].fR = [7, 30];

function shift(pose, dy, keep = []) {
  const o = {};
  for (const [k, v] of Object.entries(pose)) o[k] = keep.includes(k) ? [v[0], v[1] + dy / 2] : [v[0], v[1] + dy];
  return o;
}

const PROPS = {
  chair: (px) => { for (let x = 5; x <= 12; x++) px(x, 22, 'prop'); for (let y = 22; y <= 30; y++) { px(5, y, 'prop'); px(12, y, 'prop'); } for (let y = 14; y <= 22; y++) px(5, y, 'prop'); },
  wall: (px) => { for (let y = 2; y <= 30; y++) { px(27, y, 'prop'); px(28, y, 'prop'); } },
  table: (px) => { for (let x = 24; x <= 31; x++) px(x, 21, 'prop'); for (let y = 21; y <= 30; y++) px(29, y, 'prop'); },
  towel: () => {},
};

function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }

function interp(frames, t) {
  const n = frames.length;
  const pos = t * n;
  const i = Math.floor(pos) % n;
  const local = pos - Math.floor(pos);
  const e = 0.5 - 0.5 * Math.cos(Math.PI * local); // ease
  const A = frames[i], B = frames[(i + 1) % n];
  const o = {};
  for (const k of Object.keys(A)) o[k] = lerp(A[k], B[k], e);
  return o;
}

function line(px, a, b) {
  let x0 = Math.round(a[0]), y0 = Math.round(a[1]);
  const x1 = Math.round(b[0]), y1 = Math.round(b[1]);
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (let g = 0; g < 128; g++) {
    px(x0, y0); px(x0 + 1, y0);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

function drawPose(ctx, pose, colors, prop) {
  ctx.clearRect(0, 0, S, S);
  const px = (x, y, kind = 'fg') => {
    if (x < 0 || y < 0 || x >= S || y >= S) return;
    ctx.fillStyle = colors[kind];
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  };
  for (let x = 0; x < S; x++) px(x, GROUND + 1, 'ground');
  if (prop && PROPS[prop]) PROPS[prop](px);
  const p = pose;
  const seg = (a, b) => line(px, p[a], p[b]);
  seg('sh', 'hip');
  seg('hip', 'kR'); seg('kR', 'fR'); seg('sh', 'eR'); seg('eR', 'hR');
  seg('hip', 'kL'); seg('kL', 'fL'); seg('sh', 'eL'); seg('eL', 'hL');
  seg('head', 'sh');
  if (prop === 'towel') {
    ctx.fillStyle = colors.prop;
    const a = p.hL, b = p.hR;
    for (let x = Math.min(a[0], b[0]) - 1; x <= 31; x++) ctx.fillRect(x, Math.round(a[1]), 1, 1);
  }
  // cabeza 4×4 con esquinas recortadas
  const [hx, hy] = p.head.map(Math.round);
  ctx.fillStyle = colors.fg;
  ctx.fillRect(hx - 2, hy - 1, 5, 3);
  ctx.fillRect(hx - 1, hy - 2, 3, 5);
}

function themeColors(el) {
  const cs = getComputedStyle(el);
  return {
    fg: cs.getPropertyValue('--sprite-fg').trim() || '#fff',
    prop: cs.getPropertyValue('--sprite-prop').trim() || '#fc0',
    ground: cs.getPropertyValue('--sprite-ground').trim() || '#555',
  };
}

/**
 * Monta una animación en un canvas. Devuelve una función para detenerla.
 * @param {HTMLCanvasElement} canvas
 * @param {{procedural?:string, prop?:string}} sprite
 * @param {{reducedMotion?:boolean, periodMs?:number}} opts
 */
export function mountSprite(canvas, sprite, opts = {}) {
  canvas.width = S; canvas.height = S;
  const ctx = canvas.getContext('2d');
  const frames = ANIMS[sprite?.procedural] || ANIMS.march;
  const colors = themeColors(canvas);
  const period = opts.periodMs ?? 1600;
  const steps = 8; // animación «a saltos» estilo 8-bit
  if (opts.reducedMotion) { drawPose(ctx, frames[0], colors, sprite?.prop); return () => {}; }
  let raf = 0;
  let lastStep = -1;
  const tick = (t) => {
    const total = steps * frames.length;
    const q = Math.floor(((t % (period * frames.length / 2)) / (period * frames.length / 2)) * total);
    if (q !== lastStep) {
      lastStep = q;
      drawPose(ctx, interp(frames, q / total), colors, sprite?.prop);
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

/** Dibuja una insignia pixel placeholder (16×16) a partir del id. */
export function drawBadge(canvas, id, unlocked = true) {
  const N = 16;
  canvas.width = N; canvas.height = N;
  const ctx = canvas.getContext('2d');
  const cs = getComputedStyle(canvas);
  const c1 = cs.getPropertyValue('--primary').trim();
  const c2 = cs.getPropertyValue('--accent').trim();
  const c3 = cs.getPropertyValue('--border').trim();
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  ctx.clearRect(0, 0, N, N);
  // marco octogonal
  ctx.fillStyle = c3;
  ctx.fillRect(3, 0, 10, 16); ctx.fillRect(0, 3, 16, 10); ctx.fillRect(1, 1, 14, 14);
  ctx.fillStyle = unlocked ? c1 : c3;
  ctx.fillRect(4, 2, 8, 12); ctx.fillRect(2, 4, 12, 8); ctx.fillRect(3, 3, 10, 10);
  // glifo simétrico de 5×7 derivado del hash
  ctx.fillStyle = c2;
  for (let y = 0; y < 7; y++) for (let x = 0; x < 3; x++) {
    if ((h >> (y * 3 + x)) & 1) { ctx.fillRect(5 + x, 4 + y, 1, 1); ctx.fillRect(10 - x, 4 + y, 1, 1); }
  }
}
