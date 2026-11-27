export function createLookup(entries) {
  const map = Object.create(null);
  for (const [key, value] of entries) {
    map[key] = value;
  }
  return map;
}
