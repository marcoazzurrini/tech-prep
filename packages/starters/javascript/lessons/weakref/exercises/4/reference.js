export function forgetIfGone(cache, key) {
  if (cache.get(key)?.deref() !== undefined) {
    return false;
  }

  return cache.delete(key);
}
