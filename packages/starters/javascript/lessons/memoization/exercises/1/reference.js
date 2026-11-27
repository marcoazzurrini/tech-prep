export function memoize(fn) {
  const cache = new Map();

  const memoized = (arg) => {
    if (cache.has(arg)) {
      memoized.hits += 1;
      return cache.get(arg);
    }

    const result = fn(arg);
    cache.set(arg, result);

    return result;
  };

  memoized.hits = 0;

  return memoized;
}
