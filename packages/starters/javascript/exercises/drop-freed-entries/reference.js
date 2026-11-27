export function dropFreed(cache) {
  const dropped = [];

  for (const [name, box] of cache) {
    if (box.deref() === undefined) {
      cache.delete(name);
      dropped.push(name);
    }
  }

  return dropped.sort();
}
