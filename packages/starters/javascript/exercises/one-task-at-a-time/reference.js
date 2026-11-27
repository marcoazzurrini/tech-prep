export function makeRunner() {
  let running = false;

  return function run(task) {
    if (running) {
      throw new Error("busy");
    }

    running = true;

    try {
      return task();
    } finally {
      running = false;
    }
  };
}
