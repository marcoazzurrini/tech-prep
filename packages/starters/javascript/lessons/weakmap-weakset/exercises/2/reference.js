export function createIdTracker() {
  const ids = new WeakMap();
  let next = 1;

  return function idOf(obj) {
    if (!ids.has(obj)) {
      ids.set(obj, next);
      next++;
    }

    return ids.get(obj);
  };
}
