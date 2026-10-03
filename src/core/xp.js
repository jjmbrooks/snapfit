// XP por carta: base por nivel + bono por calificar esfuerzo.
export function xpForCard(level = 1, rated = false) {
  return 10 * Math.max(1, level) + (rated ? 5 : 0);
}
