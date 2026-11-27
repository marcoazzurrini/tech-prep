export function createBus() {
  const listeners = new Set();

  return {
    on(fn) {
      listeners.add(fn);
    },
    off(fn) {
      listeners.delete(fn);
    },
    emit(value) {
      for (const listener of listeners) {
        listener(value);
      }
    },
    count() {
      return listeners.size;
    },
  };
}
