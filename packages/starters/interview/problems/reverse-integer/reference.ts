export function reverse(x: number): number {
  const sign = x < 0 ? -1 : 1;
  let rest = Math.abs(x);
  let result = 0;
  while (rest > 0) {
    // Take the last digit of rest and put it at the end of result.
    result = result * 10 + (rest % 10);
    rest = Math.trunc(rest / 10);
  }
  result *= sign;
  // Outside the signed 32-bit range, the answer is 0.
  return result >= -(2 ** 31) && result <= 2 ** 31 - 1 ? result : 0;
}
