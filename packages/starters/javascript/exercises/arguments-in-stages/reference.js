export function inStages(fn) {
  const collect = (...args) => {
    if (args.length >= fn.length) {
      return fn(...args);
    }

    return (...more) => collect(...args, ...more);
  };

  return collect;
}
