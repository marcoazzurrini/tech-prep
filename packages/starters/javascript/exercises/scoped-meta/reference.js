export function createStore() {
  const key = Symbol("meta");
  return {
    setMeta(target, value) {
      target[key] = value;
    },
    getMeta(target) {
      return target[key];
    },
  };
}
