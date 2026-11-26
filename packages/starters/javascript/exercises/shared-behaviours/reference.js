export function perform(target, behaviours, name, ...args) {
  if (typeof target[name] === "function") {
    return target[name](...args);
  }

  const behaviour = behaviours[name];

  return typeof behaviour === "function" ? behaviour.apply(target, args) : null;
}
