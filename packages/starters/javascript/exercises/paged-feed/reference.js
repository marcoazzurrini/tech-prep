export function* feed(fetchPage) {
  for (let page = 0; ; page++) {
    const items = fetchPage(page);
    if (items.length === 0) return;
    yield* items;
  }
}
