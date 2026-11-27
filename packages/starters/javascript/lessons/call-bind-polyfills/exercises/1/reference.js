export function callWith(fn, target, ...args) {
  const key = Symbol("fn");
  target[key] = fn;
  const result = target[key](...args);
  delete target[key];
  return result;
}
