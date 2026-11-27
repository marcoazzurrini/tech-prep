export function createBoundedCache(limit) {
  let entries = [];

  return {
    set(key, value) {
      const existing = entries.find((entry) => entry[0] === key);
      if (existing) {
        existing[1] = value;
        return;
      }
      if (entries.length >= limit) {
        entries.shift();
      }
      entries.push([key, value]);
    },
    get(key) {
      const existing = entries.find((entry) => entry[0] === key);
      return existing ? existing[1] : undefined;
    },
    size() {
      return entries.length;
    },
    clear() {
      entries = [];
    },
  };
}
