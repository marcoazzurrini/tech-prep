export function onlyCatch(ErrorClass, fn, fallback) {
  return function (...args) {
    try {
      return fn.apply(this, args);
    } catch (error) {
      if (error instanceof ErrorClass) {
        return fallback;
      }

      throw error;
    }
  };
}
