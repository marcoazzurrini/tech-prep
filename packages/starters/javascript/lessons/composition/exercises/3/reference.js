export function pipe(...fns) {
  return (...args) => {
    if (fns.length === 0) {
      return args[0];
    }

    const [first, ...rest] = fns;

    return rest.reduce((result, fn) => fn(result), first(...args));
  };
}
