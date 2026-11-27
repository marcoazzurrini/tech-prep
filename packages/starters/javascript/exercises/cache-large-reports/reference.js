export function createCache(load, makeRef = (value) => new WeakRef(value)) {
  const refs = new Map();

  return {
    get(key) {
      const cached = refs.get(key)?.deref();
      if (cached !== undefined) {
        return cached;
      }

      const value = load(key);
      refs.set(key, makeRef(value));
      return value;
    },
  };
}
