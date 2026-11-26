export function countBroken(readings) {
  let count = 0;

  for (const reading of readings) {
    if (Number.isNaN(reading)) {
      count += 1;
    }
  }

  return count;
}
