export function withSetting(name, value, task) {
  const before = globalThis[name];

  globalThis[name] = value;

  try {
    return task();
  } finally {
    if (before === undefined) {
      delete globalThis[name];
    } else {
      globalThis[name] = before;
    }
  }
}
