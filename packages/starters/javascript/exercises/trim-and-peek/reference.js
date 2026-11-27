export function trimAndPeek(items, maxLength) {
  if (items.length > maxLength) {
    items.length = maxLength;
  }
  return items.length === 0 ? null : items.at(-1);
}
