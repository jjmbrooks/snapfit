// Hash router mínimo: #/, #/progreso, #/logros, #/menu, #/privacidad, #/carta/:id
export function parseRoute(hash = location.hash) {
  const path = hash.replace(/^#/, '') || '/';
  const parts = path.split('/').filter(Boolean);
  if (!parts.length) return { name: 'card' };
  if (parts[0] === 'carta' && parts[1]) return { name: 'detail', id: decodeURIComponent(parts[1]) };
  const map = { progreso: 'progress', logros: 'achievements', menu: 'menu', privacidad: 'privacy' };
  return { name: map[parts[0]] || 'card' };
}
