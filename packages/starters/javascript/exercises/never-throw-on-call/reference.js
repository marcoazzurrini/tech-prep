export function promiseOf(fn) {
  return async function (...args) {
    return fn.apply(this, args);
  };
}
