export function mergeSettings(defaults, saved) {
  return {
    ...defaults,
    ...saved,
    shortcuts: { ...defaults.shortcuts, ...saved?.shortcuts },
  };
}
