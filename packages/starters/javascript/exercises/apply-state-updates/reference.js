export function applyUpdates(start, updates) {
  let value = start;

  for (const update of updates) {
    value = typeof update === "function" ? update(value) : update;
  }

  return value;
}
