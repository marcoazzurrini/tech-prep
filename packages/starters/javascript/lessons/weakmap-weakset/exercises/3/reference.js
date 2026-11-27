export function createRunner(work) {
  const done = new WeakSet();

  return function run(job) {
    if (done.has(job)) {
      return false;
    }
    done.add(job);
    work(job);
    return true;
  };
}
