export function zipToMap(keys, values) {
  const result = new Map();
  const valueIterator = values[Symbol.iterator]();

  for (const key of keys) {
    const next = valueIterator.next();
    if (next.done) break;
    result.set(key, next.value);
  }

  valueIterator.return?.();

  return result;
}
