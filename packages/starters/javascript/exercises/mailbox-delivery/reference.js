export function createMailbox() {
  const listeners = [];

  return {
    listen(fn) {
      listeners.push(fn);
    },
    send(message) {
      queueMicrotask(() => {
        for (const listener of listeners) {
          listener(message);
        }
      });
    },
  };
}
