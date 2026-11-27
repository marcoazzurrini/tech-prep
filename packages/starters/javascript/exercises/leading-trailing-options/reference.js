// For the tests: a promise that settles after ms.
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function throttle(fn, ms, { leading = true, trailing = true } = {}) {
  let waiting = false;
  let saved = null;

  const endInterval = () => {
    if (trailing && saved) {
      const { self, args } = saved;
      saved = null;
      fn.apply(self, args);
      setTimeout(endInterval, ms);
      return;
    }

    saved = null;
    waiting = false;
  };

  return function (...args) {
    if (waiting) {
      saved = { self: this, args };
      return;
    }

    waiting = true;

    if (leading) {
      fn.apply(this, args);
    } else {
      saved = { self: this, args };
    }

    setTimeout(endInterval, ms);
  };
}
