// For the tests: a promise that fulfils with value after ms, and one that rejects.
export const later = (ms, value) => new Promise((resolve) => setTimeout(resolve, ms, value));

export const failLater = (ms, message) => {
  const promise = new Promise((resolve, reject) => setTimeout(reject, ms, new Error(message)));
  promise.catch(() => {}); // so it is never reported as unhandled
  return promise;
};


export function firstReplies(requests, n) {
  return new Promise((resolve, reject) => {
    const values = [];
    const errors = [];

    for (const request of requests) {
      Promise.resolve(request).then(
        (value) => {
          values.push(value);
          if (values.length === n) {
            resolve(values.slice());
          }
        },
        (error) => {
          errors.push(error);
          if (errors.length === requests.length - n + 1) {
            reject(new AggregateError(errors.slice(), "not enough replies"));
          }
        }
      );
    }
  });
}
