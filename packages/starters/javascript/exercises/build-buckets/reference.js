export function buildBuckets(count, items) {
  const buckets = Array.from({ length: count }, () => []);
  for (const item of items) {
    if (item.bucket >= 0 && item.bucket < count) {
      buckets[item.bucket].push(item.name);
    }
  }
  return buckets;
}
