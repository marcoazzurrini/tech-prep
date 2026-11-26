export function trace(obj, names) {
  const log = [];

  for (const name of names) {
    const original = obj[name];

    obj[name] = function (...args) {
      log.push(`${name}(${args.join(", ")})`);

      return original.apply(this, args);
    };
  }

  return log;
}
