export function watch(obj, onChange) {
  return new Proxy(obj, {
    set(target, key, value, receiver) {
      const before = Reflect.get(target, key, receiver);
      const done = Reflect.set(target, key, value, receiver);

      if (done && !Object.is(before, value)) {
        onChange(key, before, value);
      }

      return done;
    },
  });
}
