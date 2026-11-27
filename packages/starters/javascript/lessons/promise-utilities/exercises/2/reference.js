// For the tests: a promise that fulfils with value after ms, and one that rejects.
export const later = (ms, value) => new Promise((resolve) => setTimeout(resolve, ms, value));

export const failLater = (ms, message) => {
  const promise = new Promise((resolve, reject) => setTimeout(reject, ms, new Error(message)));
  promise.catch(() => {}); // so it is never reported as unhandled
  return promise;
};


export function limitTime(promise, ms, onExpire) {
  let timer;
  const limit = new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      onExpire();
      reject(new Error("timed out"));
    }, ms);
  });

  return Promise.race([promise, limit]).finally(() => clearTimeout(timer));
}
