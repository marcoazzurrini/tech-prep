export function withSetting(settings, key, value, task) {
  const hadKey = Object.hasOwn(settings, key);
  const oldValue = settings[key];

  settings[key] = value;

  try {
    return task();
  } finally {
    if (hadKey) {
      settings[key] = oldValue;
    } else {
      delete settings[key];
    }
  }
}
