export function positionsOf(list, wanted) {
  const positions = [];

  for (const [index, item] of list.entries()) {
    if (item === wanted) {
      positions.push(index);
    }
  }

  return positions;
}
