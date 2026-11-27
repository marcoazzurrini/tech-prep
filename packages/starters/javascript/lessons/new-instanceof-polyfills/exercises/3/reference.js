export function hasInChain(obj, proto) {
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return false;
  }

  let current = Object.getPrototypeOf(obj);
  while (current !== null) {
    if (current === proto) {
      return true;
    }
    current = Object.getPrototypeOf(current);
  }
  return false;
}
