// SFX chiptune PLACEHOLDER sintetizados en el momento con WebAudio (onda cuadrada). Sin archivos.
// Se reemplazan por los de melody (Kanban t_b20e2d87).
let ctx = null;
const SEQ = {
  listo: [[660, 0.07], [880, 0.07], [1320, 0.12]],
  otra: [[440, 0.05], [330, 0.07]],
  logro: [[523, 0.08], [659, 0.08], [784, 0.08], [1047, 0.2]],
  nivel: [[392, 0.08], [523, 0.08], [659, 0.08], [784, 0.08], [1047, 0.08], [1319, 0.25]],
};
export function playSfx(name) {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    let t = ctx.currentTime;
    for (const [f, d] of SEQ[name] || []) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.06, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + d);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + d);
      t += d;
    }
  } catch { /* sin audio */ }
}
