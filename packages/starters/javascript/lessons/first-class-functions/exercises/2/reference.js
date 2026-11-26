export function countWhere(items, test) {
  let count = 0;

  for (const item of items) {
    if (test(item)) {
      count += 1;
    }
  }

  return count;
}
