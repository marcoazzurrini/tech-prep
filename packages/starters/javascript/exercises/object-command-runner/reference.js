const actions = {
  get: (target, key) => Reflect.get(target, key) ?? null,
  set: (target, key, value) => Reflect.set(target, key, value),
  has: (target, key) => Reflect.has(target, key),
  delete: (target, key) => Reflect.deleteProperty(target, key),
  keys: (target) => Reflect.ownKeys(target),
};

export function runCommands(target, commands) {
  return commands.map(([name, ...args]) => {
    const action = Object.hasOwn(actions, name) ? actions[name] : null;
    return action ? action(target, ...args) : "unknown";
  });
}
