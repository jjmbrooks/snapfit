// Emblemas de escuela por id de grupo muscular (SVG en código, estilo C «grimorio arcade»).
// Son el respaldo genérico: un paquete de historia puede reemplazarlos con imágenes (manifest.assets.emblems).
// Trazo grueso + relleno claro para leerse a 32 px. viewBox 0 0 24 24.
const G = {
  // Raíz: árbol con raíces
  piernas: '<circle cx="12" cy="8" r="5.2"/><circle cx="7.4" cy="10.4" r="3.4"/><circle cx="16.6" cy="10.4" r="3.4"/><path d="M12 10v8m0 0-4 3.5M12 18l4 3.5M12 18v3.6M12 14l-2.6-2.2M12 13.4l2.6-2.4" fill="none" stroke-width="2.2"/>',
  // Arco: arco y flecha
  gluteos: '<path d="M6 3c6 2.5 9 6.5 9 9s-3 6.5-9 9" fill="none" stroke-width="2.4"/><path d="M6 3v18" fill="none" stroke-width="1.4"/><path d="M4 12h15m0 0-3-2.5m3 2.5-3 2.5" fill="none" stroke-width="2"/>',
  // Palma: mano abierta
  empuje: '<path d="M8 21c-1.6-1.2-3-3.4-3-6v-3.5c0-.8.6-1.4 1.3-1.4s1.2.6 1.2 1.4V13h.5V5.5c0-.8.6-1.4 1.3-1.4s1.2.6 1.2 1.4V11h.5V4.4c0-.8.6-1.4 1.3-1.4s1.2.6 1.2 1.4V11h.5V5.6c0-.8.6-1.4 1.3-1.4s1.2.6 1.2 1.4V14c0 3.4-1.8 5.8-3.6 7z"/>',
  // Cuerda: lazo de cuerda
  traccion: '<path d="M12 4a5 5 0 1 0 0 10 5 5 0 1 0 0-10zm0 3a2 2 0 1 1 0 4 2 2 0 1 1 0-4z" fill-rule="evenodd"/><path d="M9 13l-4 8m10-8 4 8" fill="none" stroke-width="2.4"/>',
  // Sello: escudo con estrella
  core: '<path d="M12 2.5 4.5 5.5v6c0 4.6 3.2 8.3 7.5 10 4.3-1.7 7.5-5.4 7.5-10v-6z"/><path d="m12 7.5 1.3 2.7 2.9.4-2.1 2 .5 2.9L12 14.2l-2.6 1.3.5-2.9-2.1-2 2.9-.4z" class="em-cut"/>',
  // Nudo: nudo entrelazado
  movilidad: '<path d="M8 4h8l4 4v8l-4 4H8l-4-4V8z" fill="none" stroke-width="2.2"/><path d="M8 8h8v8H8z" fill="none" stroke-width="2.2"/><path d="M4 12h16M12 4v16" fill="none" stroke-width="1.6"/>',
  // Latido: corazón con pulso
  cardio: '<path d="M12 21s-8-4.9-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.1-8 11-8 11z"/><path d="M5 12h3.5l1.5-3 2.5 6 1.5-3H19" fill="none" class="em-cut-stroke" stroke-width="1.8"/>',
};

/** SVG del emblema (decorativo; el nombre de la escuela va en texto aparte). */
export function emblemSVG(group) {
  return `<svg class="em-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${G[group] || '<circle cx="12" cy="12" r="6"/>'}</svg>`;
}
export const EMBLEM_GROUPS = Object.keys(G);
