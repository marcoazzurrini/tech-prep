export function onlyNumbers(obj) {
  return new Proxy(obj, {
    set(target, key, value, receiver) {
      if (typeof value !== "number") {
        throw new TypeError(`${String(key)} must be a number`);
      }

      return Reflect.set(target, key, value, receiver);
    },
  });
}
