export function withDefault(obj, fallback) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      if (typeof key === "string" && !(key in target)) {
        return fallback;
      }

      return Reflect.get(target, key, receiver);
    },
  });
}
