export function withDefaults(settings, defaults) {
  const result = {};

  for (const key of Object.keys(defaults)) {
    result[key] = settings[key] === undefined ? defaults[key] : settings[key];
  }

  return result;
}
