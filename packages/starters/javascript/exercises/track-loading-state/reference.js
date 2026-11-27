// For the tests: promises that settle after ms, and a pause.
export const fulfilled = (value, ms = 0) => new Promise((resolve) => setTimeout(resolve, ms, value));
export const rejected = (message, ms = 0) =>
  new Promise((resolve, reject) => setTimeout(reject, ms, new Error(message)));
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function withLoading(state, promise) {
  state.loading = true;

  return promise.finally(() => {
    state.loading = false;
  });
}
