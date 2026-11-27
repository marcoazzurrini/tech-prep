// For the tests: a promise that fulfils with value after ms, and one that rejects.
export const later = (ms, value) => new Promise((resolve) => setTimeout(resolve, ms, value));

export const failLater = (ms, message) => {
  const promise = new Promise((resolve, reject) => setTimeout(reject, ms, new Error(message)));
  promise.catch(() => {}); // so it is never reported as unhandled
  return promise;
};


export function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const list = [...iterable];
    const results = [];
    let done = 0;

    if (list.length === 0) {
      resolve(results);
      return;
    }

    list.forEach((item, i) => {
      Promise.resolve(item).then((value) => {
        results[i] = value;
        done += 1;
        if (done === list.length) {
          resolve(results);
        }
      }, reject);
    });
  });
}
