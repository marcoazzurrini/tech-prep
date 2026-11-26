export function swapNeighbours(list) {
  for (let i = 0; i + 1 < list.length; i += 2) {
    [list[i], list[i + 1]] = [list[i + 1], list[i]];
  }

  return list;
}
