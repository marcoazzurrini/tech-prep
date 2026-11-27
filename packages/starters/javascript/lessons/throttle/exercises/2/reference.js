// For the tests: a promise that settles after ms.
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function throttle(fn, ms) {
  let waiting = false;
  let saved = null;

  function throttled(...args) {
    if (waiting) {
      saved = { self: this, args };
      return;
    }

    fn.apply(this, args);
    waiting = true;
    setTimeout(() => {
      waiting = false;

      if (saved) {
        const { self, args: last } = saved;
        saved = null;
        throttled.apply(self, last);
      }
    }, ms);
  }

  return throttled;
}
