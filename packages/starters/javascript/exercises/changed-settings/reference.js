export function changedSettings(layer) {
  const below = Object.getPrototypeOf(layer);
  const changed = {};

  for (const key of Object.keys(layer)) {
    if (below === null || layer[key] !== below[key]) {
      changed[key] = layer[key];
    }
  }

  return changed;
}
