export function promisifyMany(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (error, ...values) => (error ? reject(error) : resolve(values)));
    });
}
