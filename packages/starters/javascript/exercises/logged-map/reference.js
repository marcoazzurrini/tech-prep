export function loggedMap(map, log) {
  return new Proxy(map, {
    get(target, key) {
      const value = Reflect.get(target, key, target);

      if (typeof value !== "function") {
        return value;
      }

      return (...args) => {
        log.push(String(key));
        return Reflect.apply(value, target, args);
      };
    },
  });
}
