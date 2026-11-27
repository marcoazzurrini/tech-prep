export function removeKeys(obj, keys) {
  const kept = [];

  for (const key of keys) {
    if (!Reflect.deleteProperty(obj, key)) {
      kept.push(key);
    }
  }

  return kept;
}
