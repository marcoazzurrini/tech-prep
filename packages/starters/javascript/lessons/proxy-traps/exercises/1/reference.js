export function makeRange(min, max) {
  return new Proxy({}, {
    has(target, key) {
      if (typeof key !== "string" || key === "") {
        return false;
      }

      const n = Number(key);
      return n >= min && n <= max;
    },
  });
}
