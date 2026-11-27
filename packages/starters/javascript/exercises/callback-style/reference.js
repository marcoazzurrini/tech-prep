export function callbackify(fn) {
  return function (...args) {
    const callback = args.pop();

    new Promise((resolve) => resolve(fn.apply(this, args))).then(
      (value) => callback(null, value),
      (error) => callback(error)
    );
  };
}
