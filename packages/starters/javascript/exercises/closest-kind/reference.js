export function closestKind(value, constructors) {
  if (value === null || (typeof value !== "object" && typeof value !== "function")) {
    return null;
  }

  for (let proto = Object.getPrototypeOf(value); proto !== null; proto = Object.getPrototypeOf(proto)) {
    const match = constructors.find((F) => F.prototype === proto);

    if (match) {
      return match.name;
    }
  }

  return null;
}
