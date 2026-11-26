export function withRetries(fn, attempts) {
  return function (...args) {
    let lastError;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        return fn.apply(this, args);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  };
}
