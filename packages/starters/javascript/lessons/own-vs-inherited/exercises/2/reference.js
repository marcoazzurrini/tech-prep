export function inheritedKeys(obj) {
  const keys = [];

  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) {
      keys.push(key);
    }
  }

  return keys;
}
