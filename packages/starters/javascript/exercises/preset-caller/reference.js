export function preset(fn, target, ...fixed) {
  function wrapped(...args) {
    if (this instanceof wrapped) {
      return new fn(...fixed, ...args);
    }
    return fn.apply(target, [...fixed, ...args]);
  }
  if (fn.prototype) {
    wrapped.prototype = Object.create(fn.prototype);
  }
  return wrapped;
}
