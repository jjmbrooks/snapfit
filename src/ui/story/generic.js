// Historia GENÉRICA: último eslabón del fallback (paquete activo → paquete por defecto → genérica).
// Neutral y completa, sin mundo. Se construye con los nombres de interfaz (content/copy/es.json).
import COPY from '../../../content/copy/es.json';

const ICONS = { piernas: '🦵', gluteos: '🍑', empuje: '✋', traccion: '🪢', core: '🛡️', movilidad: '🌀', cardio: '❤️' };

export function genericStory(badgeIds) {
  const G = COPY.names.groups;
  return {
    id: 'generic',
    title: 'SnapFit',
    logline: 'Una carta. Un movimiento. ¡Listo!',
    welcome: { title: 'SnapFit', lines: ['Una carta. Un movimiento. ¡Listo!'], cta: 'Empezar', note: '' },
    signin: { title: 'Entra con Google', body: 'Guarda tu mazo, tu nivel y tus logros en cualquier teléfono.', offline: 'Después del primer inicio de sesión, funciona <b>sin internet</b>.' },
    deckReady: { title: 'Tu mazo está listo' },
    guide: { name: 'SnapFit', role: '' },
    families: Object.fromEntries(Object.keys(ICONS).map((g) => [g, { name: G[g], icon: ICONS[g] }])),
    tiers: { 1: 'Rango 1', 2: 'Rango 2', 3: 'Rango 3', 4: 'Rango 4' },
    regions: Object.fromEntries(Array.from({ length: 10 }, (_, i) => [String(i + 1), `Nivel ${i + 1}`])),
    rewards: ['¡Listo!'],
    reminders: ['Tu mazo te espera: una carta y listo.'],
    badges: Object.fromEntries(badgeIds.map((id) => [id, { name: id, desc: '' }])),
  };
}
