export function decodeAndFilter(text, dropKeys) {
  const obj = JSON.parse(text, (key, value) =>
    dropKeys.includes(key) ? undefined : value
  );
  return Object.entries(obj).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
}
