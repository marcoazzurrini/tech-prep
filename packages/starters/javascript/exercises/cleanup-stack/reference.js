export function makeStack() {
  const cleanups = [];
  let disposed = false;

  return {
    defer(fn) {
      cleanups.push(fn);
    },

    [Symbol.dispose]() {
      if (disposed) {
        return;
      }

      disposed = true;
      let failed = false;
      let firstError;

      while (cleanups.length > 0) {
        const fn = cleanups.pop();

        try {
          fn();
        } catch (error) {
          if (!failed) {
            failed = true;
            firstError = error;
          }
        }
      }

      if (failed) {
        throw firstError;
      }
    },
  };
}
