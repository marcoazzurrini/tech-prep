export function runAs(target, fn, ...args) {
  const key = Symbol("run");
  target[key] = fn;
  try {
    return target[key](...args);
  } finally {
    delete target[key];
  }
}
