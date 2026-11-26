function toLine(item, prefix) {
  return prefix + item;
}

export function packingList(items, prefix) {
  const lines = [];

  for (const item of items) {
    lines.push(toLine(item, prefix));
  }

  return lines;
}
