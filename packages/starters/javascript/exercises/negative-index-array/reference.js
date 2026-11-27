const toIndex = (target, key) => {
  if (typeof key !== "string") {
    return key;
  }

  const index = Number(key);
  return Number.isInteger(index) && index < 0 ? String(target.length + index) : key;
};

export function withNegativeIndex(array) {
  return new Proxy(array, {
    get(target, key, receiver) {
      return Reflect.get(target, toIndex(target, key), receiver);
    },
    set(target, key, value, receiver) {
      return Reflect.set(target, toIndex(target, key), value, receiver);
    },
  });
}
