export function rotateRight(list, k) {
  if (list.length === 0) {
    return [];
  }

  const cut = list.length - (k % list.length);
  return list.slice(cut).concat(list.slice(0, cut));
}
