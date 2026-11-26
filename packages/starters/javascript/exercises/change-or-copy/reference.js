export function applyChanges(settings, changes) {
  try {
    for (const key of Object.keys(changes)) {
      settings[key] = changes[key];
    }

    return settings;
  } catch {
    return { ...settings, ...changes };
  }
}
