// For the tests: a promise that settles after ms.
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function throttle(fn, ms) {
  let waiting = false;

  return function (...args) {
    if (waiting) {
      return;
    }

    fn.apply(this, args);
    waiting = true;
    setTimeout(() => {
      waiting = false;
    }, ms);
  };
}
