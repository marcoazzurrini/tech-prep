export function resolveSetting(key, layers) {
  for (const layer of layers) {
    const value = layer?.[key] ?? null;

    if (value !== null) {
      return value;
    }
  }

  return null;
}
