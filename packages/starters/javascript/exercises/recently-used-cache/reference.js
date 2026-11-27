export function createLruCache(limit) {
  const entries = new Map();

  return {
    get(key) {
      if (!entries.has(key)) {
        return null;
      }

      const value = entries.get(key);
      entries.delete(key);
      entries.set(key, value);
      return value;
    },
    set(key, value) {
      entries.delete(key);

      if (entries.size === limit) {
        const [oldest] = entries.keys();
        entries.delete(oldest);
      }

      entries.set(key, value);
    },
    size() {
      return entries.size;
    },
  };
}
