export function isPrimitive(value) {
  if (value === null) {
    return true;
  }

  return typeof value !== "object" && typeof value !== "function";
}
