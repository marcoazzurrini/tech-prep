const isObject = (value) => value !== null && typeof value === "object";

export function sameContent(a, b) {
  if (!isObject(a) || !isObject(b)) {
    return a === b;
  }

  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  const keys = Object.keys(a);

  if (keys.length !== Object.keys(b).length) {
    return false;
  }

  return keys.every((key) => Object.hasOwn(b, key) && sameContent(a[key], b[key]));
}
