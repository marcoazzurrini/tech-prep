export function curry(fn, arity = fn.length) {
  const curried = (...args) => {
    if (args.length >= arity) {
      return fn(...args);
    }

    return (...more) => curried(...args, ...more);
  };

  return curried;
}
