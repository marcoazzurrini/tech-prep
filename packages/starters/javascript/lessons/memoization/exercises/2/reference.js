export function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (!cache.has(key)) {
      cache.set(key, fn.apply(this, args));
    }

    return cache.get(key);
  };
}
