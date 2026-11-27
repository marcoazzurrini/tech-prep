export function repeat(item, times) {
  return {
    [Symbol.iterator]() {
      let left = times;

      return {
        next() {
          if (left === 0) return { value: undefined, done: true };
          left--;
          return { value: item, done: false };
        },
      };
    },
  };
}
