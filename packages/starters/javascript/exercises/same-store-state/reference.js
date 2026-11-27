const kindOf = (value) => {
  if (value instanceof Map) {
    return "map";
  }
  if (value instanceof Set) {
    return "set";
  }
  return Array.isArray(value) ? "array" : "object";
};

export function sameState(a, b) {
  if (Object.is(a, b)) {
    return true;
  }
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }

  const kind = kindOf(a);
  if (kind !== kindOf(b)) {
    return false;
  }

  if (kind === "map") {
    return a.size === b.size && [...a].every(([key, value]) => b.has(key) && sameState(value, b.get(key)));
  }
  if (kind === "set") {
    return a.size === b.size && [...a].every((item) => b.has(item));
  }

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }
  return keys.every((key) => Object.hasOwn(b, key) && sameState(a[key], b[key]));
}
