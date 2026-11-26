export function sameValue(a, b) {
  if (a === b) {
    // 0 === -0, so tell the two zeros apart by the sign of 1 / x.
    return a !== 0 || 1 / a === 1 / b;
  }

  // Only NaN differs from itself.
  return a !== a && b !== b;
}
