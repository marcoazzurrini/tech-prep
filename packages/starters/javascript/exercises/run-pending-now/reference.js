// For the tests: a promise that settles after ms.
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function debounce(fn, ms) {
  let timer;
  let waiting = null;
  let result;

  const run = () => {
    const { self, args } = waiting;
    waiting = null;
    result = fn.apply(self, args);
  };

  function debounced(...args) {
    clearTimeout(timer);
    waiting = { self: this, args };
    timer = setTimeout(run, ms);

    return result;
  }

  debounced.flush = () => {
    clearTimeout(timer);

    if (waiting) {
      run();
    }

    return result;
  };

  debounced.cancel = () => {
    clearTimeout(timer);
    waiting = null;
  };

  return debounced;
}
