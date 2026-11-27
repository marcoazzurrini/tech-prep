// For the tests: a promise that fulfils with value after ms, and one that rejects.
export const later = (ms, value) => new Promise((resolve) => setTimeout(resolve, ms, value));

export const failLater = (ms, message) => {
  const promise = new Promise((resolve, reject) => setTimeout(reject, ms, new Error(message)));
  promise.catch(() => {}); // so it is never reported as unhandled
  return promise;
};


export function resolveDeep(value) {
  return Promise.resolve(value).then((tree) => {
    if (tree === null || typeof tree !== "object") {
      return tree;
    }

    const keys = Object.keys(tree);
    const out = Array.isArray(tree) ? [] : {};
    if (keys.length === 0) {
      return out;
    }

    return new Promise((resolve, reject) => {
      let done = 0;
      for (const key of keys) {
        resolveDeep(tree[key]).then((result) => {
          out[key] = result;
          done += 1;
          if (done === keys.length) {
            resolve(out);
          }
        }, reject);
      }
    });
  });
}
