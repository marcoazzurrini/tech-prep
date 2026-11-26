export function digitCount(n) {
  let count = 0;
  let rest = n;

  do {
    count++;
    rest = Math.floor(rest / 10);
  } while (rest > 0);

  return count;
}
