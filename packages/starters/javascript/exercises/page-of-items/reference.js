export function pageOf(items, size = items.length, page = 1) {
  const start = (page - 1) * size;

  return items.slice(start, start + size);
}
