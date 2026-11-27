export function createInbox() {
  const items = [];
  const waiting = [];

  return {
    put(item) {
      if (waiting.length > 0) {
        waiting.shift()(item);
      } else {
        items.push(item);
      }
    },
    take() {
      if (items.length > 0) {
        return Promise.resolve(items.shift());
      }
      const { promise, resolve } = Promise.withResolvers();
      waiting.push(resolve);
      return promise;
    },
  };
}
