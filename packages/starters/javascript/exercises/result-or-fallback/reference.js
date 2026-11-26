export function callOr(fn, fallback) {
  const result = fn();

  return result === undefined ? fallback : result;
}
