// For the tests: a promise that settles after ms.
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function debounce(fn, ms) {
  let timer;

  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      fn.apply(this, args);
    }, ms);
  }

  debounced.cancel = () => {
    clearTimeout(timer);
    timer = undefined;
  };

  debounced.pending = () => timer !== undefined;

  return debounced;
}
