export function stats(numbers) {
  return numbers.reduce(
    (acc, n) => {
      acc.count += 1;
      acc.sum += n;
      acc.min = acc.min === null ? n : Math.min(acc.min, n);
      acc.max = acc.max === null ? n : Math.max(acc.max, n);
      return acc;
    },
    { count: 0, sum: 0, min: null, max: null },
  );
}
