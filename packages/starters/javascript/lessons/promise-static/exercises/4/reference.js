export function createGate() {
  const { promise, resolve } = Promise.withResolvers();
  return { opened: promise, open: resolve };
}
