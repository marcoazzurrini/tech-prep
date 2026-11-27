export function firstToSucceed(tasks) {
  return Promise.any(tasks.map((task, index) => task().then((value) => ({ index, value }))));
}
