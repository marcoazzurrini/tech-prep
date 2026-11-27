export function lockKeys(obj, keys) {
  for (const key of keys) {
    if (Object.hasOwn(obj, key)) {
      Object.defineProperty(obj, key, { writable: false, configurable: false });
    }
  }

  return obj;
}
