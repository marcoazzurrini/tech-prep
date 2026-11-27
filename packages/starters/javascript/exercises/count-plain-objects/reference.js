function isPlain(value) {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function countPlainObjects(value) {
  if (Array.isArray(value)) {
    let total = 0;
    for (const item of value) {
      total += countPlainObjects(item);
    }
    return total;
  }
  if (!isPlain(value)) return 0;
  let total = 1;
  for (const val of Object.values(value)) {
    total += countPlainObjects(val);
  }
  return total;
}
