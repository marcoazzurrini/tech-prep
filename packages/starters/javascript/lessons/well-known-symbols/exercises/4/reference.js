export function countdown(from) {
  return {
    async *[Symbol.asyncIterator]() {
      for (let n = from; n > 0; n -= 1) {
        yield n;
      }
    },
  };
}
