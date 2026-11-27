export function makeTicker(limit) {
  let tick = 0;

  return {
    next() {
      tick++;
      if (tick > limit) return { value: undefined, done: true };
      return { value: tick, done: false };
    },
    [Symbol.iterator]() {
      return this;
    },
  };
}
