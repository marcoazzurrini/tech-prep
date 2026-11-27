export function range(start, end, step = 1) {
  return {
    [Symbol.iterator]() {
      let current = start;

      return {
        next() {
          const inside = step > 0 ? current < end : current > end;
          if (!inside) return { value: undefined, done: true };

          const value = current;
          current += step;
          return { value, done: false };
        },
      };
    },
  };
}
