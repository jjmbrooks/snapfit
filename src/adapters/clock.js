// ClockPort: hora actual y offset local (minutos a sumar a UTC).
export const clock = {
  now: () => Date.now(),
  tzOffsetMin: () => -new Date().getTimezoneOffset(),
};
