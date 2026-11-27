// For the tests: a promise that fulfils with value after ms, and one that rejects.
export const later = (ms, value) => new Promise((resolve) => setTimeout(resolve, ms, value));

export const failLater = (ms, message) => {
  const promise = new Promise((resolve, reject) => setTimeout(reject, ms, new Error(message)));
  promise.catch(() => {}); // so it is never reported as unhandled
  return promise;
};


export function whichFirst(list) {
  return new Promise((resolve) => {
    let i = 0;
    for (const item of list) {
      const index = i;
      Promise.resolve(item).then(
        () => resolve(index),
        () => resolve(index)
      );
      i += 1;
    }
  });
}
