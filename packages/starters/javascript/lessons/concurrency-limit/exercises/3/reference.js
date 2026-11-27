// For the tests. tracker() gives a log and two ways to make a task:
// t.job(name, ms) logs "start name", waits ms, logs "end name" and fulfils with name.
// t.fail(name, ms) logs "start name", waits ms, logs "fail name" and rejects.
// wait(ms, value) fulfils with value after ms.
export const wait = (ms, value) => new Promise((resolve) => setTimeout(resolve, ms, value));

export function tracker() {
  const log = [];
  const job = (name, ms) => async () => {
    log.push("start " + name);
    await wait(ms);
    log.push("end " + name);
    return name;
  };
  const fail = (name, ms) => async () => {
    log.push("start " + name);
    await wait(ms);
    log.push("fail " + name);
    throw new Error(name + " failed");
  };
  return { log, job, fail };
}


export function createQueue(limit) {
  let running = 0;
  const waiting = [];

  function startNext() {
    if (running >= limit || waiting.length === 0) {
      return;
    }
    const { task, resolve, reject } = waiting.shift();
    running += 1;
    task()
      .then(resolve, reject)
      .finally(() => {
        running -= 1;
        startNext();
      });
  }

  return {
    add(task) {
      return new Promise((resolve, reject) => {
        waiting.push({ task, resolve, reject });
        startNext();
      });
    },
  };
}
