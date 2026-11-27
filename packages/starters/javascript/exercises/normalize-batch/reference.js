export function normalizeBatch(input, fallback) {
  return Array.from(input, (value) => value ?? fallback);
}
