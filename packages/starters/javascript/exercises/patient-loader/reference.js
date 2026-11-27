// For the tests: a promise that fulfils with value after ms, and one that rejects.
export const later = (ms, value) => new Promise((resolve) => setTimeout(resolve, ms, value));

export const failLater = (ms, message) => {
  const promise = new Promise((resolve, reject) => setTimeout(reject, ms, new Error(message)));
  promise.catch(() => {}); // so it is never reported as unhandled
  return promise;
};


function withLimit(promise, ms) {
  let timer;
  const limit = new Promise((resolve, reject) => {
    timer = setTimeout(() => reject(new Error("too slow")), ms);
  });
  return Promise.race([promise, limit]).finally(() => clearTimeout(timer));
}

export async function loadPatiently(load, tries, ms) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await withLimit(Promise.resolve().then(load), ms);
    } catch (error) {
      if (attempt >= tries) {
        throw error;
      }
    }
  }
}
