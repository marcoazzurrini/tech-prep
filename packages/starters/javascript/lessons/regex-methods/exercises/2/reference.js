export function readSettings(text) {
  const settings = {};

  for (const m of text.matchAll(/(\w+)=(\w+)/g)) {
    settings[m[1]] = m[2];
  }

  return settings;
}
