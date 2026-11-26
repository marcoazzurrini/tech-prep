export function remember(cache, key, compute) {
  return (cache[key] ??= compute());
}
