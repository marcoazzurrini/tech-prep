export function invokeOn(target, fn, ...args) {
  // A symbol key cannot clash with a property the target already has.
  const key = Symbol("borrowed");

  target[key] = fn;

  try {
    return target[key](...args);
  } finally {
    delete target[key];
  }
}
