export function waitForGuests(names) {
  const { promise, resolve } = Promise.withResolvers();
  const expected = new Set(names);
  const order = [];

  if (expected.size === 0) {
    resolve(order);
  }

  return {
    arrived: promise,
    arrive(name) {
      if (!expected.has(name)) {
        return;
      }
      expected.delete(name);
      order.push(name);
      if (expected.size === 0) {
        resolve([...order]);
      }
    },
  };
}
