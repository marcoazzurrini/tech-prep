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


export async function loadAll(ids, load, limit) {
  const unique = [...new Set(ids)];
  const records = new Map();
  let next = 0;

  async function worker() {
    while (next < unique.length) {
      const id = unique[next];
      next += 1;
      records.set(id, await load(id));
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, unique.length) }, () => worker()));
  return ids.map((id) => records.get(id));
}
