export function sameAmount(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}
