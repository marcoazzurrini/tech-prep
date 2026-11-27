export function fromList(values) {
  return {
    [Symbol.asyncIterator]() {
      let i = 0;

      return {
        next() {
          if (i < values.length) {
            return Promise.resolve({ value: values[i++], done: false });
          }

          return Promise.resolve({ value: undefined, done: true });
        },
      };
    },
  };
}
