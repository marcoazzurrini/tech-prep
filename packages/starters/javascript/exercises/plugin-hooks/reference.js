export function createHooks() {
  const hooks = new Map();

  const tap = (name, fn) => {
    hooks.set(name, [...(hooks.get(name) ?? []), fn]);
    return () => {
      hooks.set(name, (hooks.get(name) ?? []).filter((item) => item !== fn));
    };
  };

  const tapOnce = (name, fn) => {
    const remove = tap(name, (...args) => {
      remove();
      return fn(...args);
    });
    return remove;
  };

  const run = (name, ...args) => {
    const errors = [];
    for (const fn of hooks.get(name) ?? []) {
      try {
        fn(...args);
      } catch (error) {
        errors.push(error.message);
      }
    }
    return errors;
  };

  return { tap, tapOnce, run };
}
