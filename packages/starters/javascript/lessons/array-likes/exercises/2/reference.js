export function extractIndexed(source) {
  return Array.from(source, (value) => (value === undefined ? null : value));
}
