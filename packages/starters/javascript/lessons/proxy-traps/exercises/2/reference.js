export function sortedKeys(obj) {
  return new Proxy(obj, {
    ownKeys(target) {
      const keys = Reflect.ownKeys(target);
      const strings = keys.filter((key) => typeof key === "string").sort();
      const symbols = keys.filter((key) => typeof key === "symbol");
      return [...strings, ...symbols];
    },
  });
}
