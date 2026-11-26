export function lazySums(numbers) {
  const sums = [];
  let total = 0;

  for (const value of numbers) {
    total += value;

    const sum = total;

    sums.push(() => sum);
  }

  return sums;
}
