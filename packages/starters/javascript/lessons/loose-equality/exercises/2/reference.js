export function countMissing(values) {
  let count = 0;

  for (const value of values) {
    if (value == null) {
      count += 1;
    }
  }

  return count;
}
