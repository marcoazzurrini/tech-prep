export function overriddenKeys(obj) {
  const proto = Object.getPrototypeOf(obj);

  if (proto === null) {
    return [];
  }

  return Object.keys(obj).filter((key) => key in proto);
}
