export const compose = (...fns) => (value) =>
  fns.reduceRight((result, fn) => fn(result), value);
