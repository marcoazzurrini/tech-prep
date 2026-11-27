// For the tests: a promise that fulfils with value after ms, and one that rejects.
export const later = (ms, value) => new Promise((resolve) => setTimeout(resolve, ms, value));

export const failLater = (ms, message) => {
  const promise = new Promise((resolve, reject) => setTimeout(reject, ms, new Error(message)));
  promise.catch(() => {}); // so it is never reported as unhandled
  return promise;
};


export function allKeyed(tasks) {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(tasks);
    const results = {};
    let done = 0;

    for (const key of keys) {
      Promise.resolve(tasks[key]).then((value) => {
        results[key] = value;
        done += 1;
        if (done === keys.length) {
          resolve(results);
        }
      }, reject);
    }
  });
}
