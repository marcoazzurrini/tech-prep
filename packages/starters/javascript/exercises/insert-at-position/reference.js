export function insertAt(list, index, items) {
  return [...list.slice(0, index), ...items, ...list.slice(index)];
}
