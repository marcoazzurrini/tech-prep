export function is(a, b) {
  if (a === b) {
    // 0 and -0 are equal here. Dividing by them tells the two apart.
    return a !== 0 || 1 / a === 1 / b;
  }

  return Number.isNaN(a) && Number.isNaN(b);
}
