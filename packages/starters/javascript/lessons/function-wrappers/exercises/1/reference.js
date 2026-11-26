export function withFallback(fn, fallback) {
  return function (...args) {
    try {
      return fn.apply(this, args);
    } catch {
      return fallback;
    }
  };
}
