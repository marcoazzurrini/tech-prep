export function addAsyncMethods(obj) {
  for (const [name, method] of Object.entries(obj)) {
    if (typeof method !== "function") {
      continue;
    }

    obj[name + "Async"] = (...args) =>
      new Promise((resolve, reject) => {
        method.call(obj, ...args, (error, value) => (error ? reject(error) : resolve(value)));
      });
  }

  return obj;
}
