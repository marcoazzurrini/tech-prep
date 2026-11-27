// For the tests: a loader that fails `failures` times, then gives `value`.
export const flaky = (failures, value) => {
  const load = (callback) =>
    setTimeout(() => {
      load.calls++;
      if (load.calls <= failures) {
        callback(new Error("fail " + load.calls));
      } else {
        callback(null, value);
      }
    }, 0);

  load.calls = 0;
  return load;
};

// For the tests: a promise that settles after ms.
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function loadWithRetry(load, tries, done) {
  load((error, value) => {
    if (!error) {
      done(null, value);
      return;
    }

    if (tries <= 1) {
      done(error);
      return;
    }

    loadWithRetry(load, tries - 1, done);
  });
}
