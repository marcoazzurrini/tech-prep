export function lockLevel(obj) {
  if (Object.isFrozen(obj)) {
    return "frozen";
  }
  if (Object.isSealed(obj)) {
    return "sealed";
  }
  if (!Object.isExtensible(obj)) {
    return "fixed";
  }
  return "open";
}
