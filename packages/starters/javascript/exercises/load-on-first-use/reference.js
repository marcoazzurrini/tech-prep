export function lazy(load) {
  let pending;

  return async function call(name, ...args) {
    pending ??= load();

    const module = await pending;

    return module[name](...args);
  };
}
