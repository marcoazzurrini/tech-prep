export function createChannel() {
  const listeners = new Set();

  function on(fn) {
    const entry = (value) => fn(value);
    listeners.add(entry);
    return () => listeners.delete(entry);
  }

  function once(fn) {
    const off = on((value) => {
      off();
      fn(value);
    });
    return off;
  }

  function emit(value) {
    for (const listener of [...listeners]) {
      if (listeners.has(listener)) {
        listener(value);
      }
    }
  }

  return { on, once, emit, size: () => listeners.size };
}
