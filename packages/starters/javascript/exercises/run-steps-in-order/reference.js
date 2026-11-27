// For the tests: a step that waits ms, logs its name, then calls next.
export const step = (log, name, ms) => (next) =>
  setTimeout(() => {
    log.push(name);
    next();
  }, ms);

// For the tests: a promise that settles after ms.
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function runInOrder(steps, done) {
  const runFrom = (index) => {
    if (index === steps.length) {
      done();
      return;
    }

    steps[index](() => runFrom(index + 1));
  };

  runFrom(0);
}
