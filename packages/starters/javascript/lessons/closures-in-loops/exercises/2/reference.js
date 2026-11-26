export function makeMultipliers(count) {
  const multipliers = [];

  for (let factor = 0; factor < count; factor++) {
    multipliers.push((n) => n * factor);
  }

  return multipliers;
}
