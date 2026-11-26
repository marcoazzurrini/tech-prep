export function logCalls(fn, log) {
  return function (...args) {
    log.push(args);

    return fn.apply(this, args);
  };
}
