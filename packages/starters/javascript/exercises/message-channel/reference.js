export function createChannel() {
  const values = [];
  const waiting = [];
  let closed = false;

  return {
    push(value) {
      if (closed) {
        return;
      }

      const reader = waiting.shift();

      if (reader) {
        reader({ value, done: false });
      } else {
        values.push(value);
      }
    },

    close() {
      closed = true;

      for (const reader of waiting.splice(0)) {
        reader({ value: undefined, done: true });
      }
    },

    [Symbol.asyncIterator]() {
      return {
        next() {
          if (values.length > 0) {
            return Promise.resolve({ value: values.shift(), done: false });
          }

          if (closed) {
            return Promise.resolve({ value: undefined, done: true });
          }

          return new Promise((resolve) => waiting.push(resolve));
        },
      };
    },
  };
}
