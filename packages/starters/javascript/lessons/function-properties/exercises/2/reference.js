export function callWhenReady(fn, args) {
  const missing = fn.length - args.length;

  if (missing > 0) {
    return `missing ${missing}`;
  }

  return fn(...args);
}
