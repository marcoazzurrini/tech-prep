// For the tests: promises that settle after ms, and a pause.
export const fulfilled = (value, ms = 0) => new Promise((resolve) => setTimeout(resolve, ms, value));
export const rejected = (message, ms = 0) =>
  new Promise((resolve, reject) => setTimeout(reject, ms, new Error(message)));
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function toCallback(promise, callback) {
  promise.then(
    (value) => callback(null, value),
    (error) => callback(error)
  );
}
