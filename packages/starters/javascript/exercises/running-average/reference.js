export function makeAverager() {
  let sum = 0;
  let count = 0;

  return (value) => {
    sum += value;
    count += 1;

    return sum / count;
  };
}
