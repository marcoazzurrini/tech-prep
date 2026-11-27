export function firstAvailable(promises) {
  return Promise.any(promises);
}
