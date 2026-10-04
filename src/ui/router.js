// Hash router mínimo: #/, #/progreso, #/logros, #/menu, #/privacidad, #/carta/:id, #/muestra/:id/:nivel
export function parseRoute(hash = location.hash) {
  const path = hash.replace(/^#/, '') || '/';
  const parts = path.split('/').filter(Boolean);
  if (!parts.length) return { name: 'card' };
  if (parts[0] === 'carta' && parts[1]) return { name: 'detail', id: decodeURIComponent(parts[1]) };
  // Muestra de carta a cualquier nivel (galería de rangos para QA/capturas; solo lectura, no registra nada).
  if (parts[0] === 'muestra' && parts[1]) return { name: 'sample', id: decodeURIComponent(parts[1]), level: Math.min(10, Math.max(1, parseInt(parts[2], 10) || 1)) };
  const map = { progreso: 'progress', logros: 'achievements', menu: 'menu', privacidad: 'privacy', perfil: 'profile' };
  return { name: map[parts[0]] || 'card' };
}
