const samePrimitive = (a, b) => a === b || (Number.isNaN(a) && Number.isNaN(b));

export function sameReadings(a, b) {
  if (samePrimitive(a, b)) {
    return true;
  }
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }
  return keys.every((key) => Object.hasOwn(b, key) && sameReadings(a[key], b[key]));
}
