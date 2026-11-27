export function fallbackBind(fn, fallback) {
  return function (...args) {
    const receiver = this === undefined ? fallback : this;
    return fn.apply(receiver, args);
  };
}
