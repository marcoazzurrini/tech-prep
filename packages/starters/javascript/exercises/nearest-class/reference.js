export function nearestClass(value, classes) {
  if (value === null || (typeof value !== "object" && typeof value !== "function")) {
    return null;
  }

  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    const match = classes.find((cls) => cls.prototype === proto);
    if (match) {
      return match.name;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return null;
}
