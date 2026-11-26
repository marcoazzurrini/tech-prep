export function makeAccumulator(start) {
  let total = start;

  return (amount) => {
    total += amount;

    return total;
  };
}
