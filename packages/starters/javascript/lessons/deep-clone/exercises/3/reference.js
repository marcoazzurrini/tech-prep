export function cloneGraph(value, seen = new WeakMap()) {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (seen.has(value)) {
    return seen.get(value);
  }

  const copy = Array.isArray(value) ? [] : {};
  seen.set(value, copy);

  for (const key of Object.keys(value)) {
    copy[key] = cloneGraph(value[key], seen);
  }
  return copy;
}
