export function roundToStep(value, step) {
  const steps = Math.round(Math.abs(value) / step);
  return Math.sign(value) * steps * step;
}
