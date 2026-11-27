export function everyNth(list, n) {
  return list.filter((_, index) => (index + 1) % n === 0);
}
