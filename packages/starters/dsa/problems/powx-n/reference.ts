export function myPow(x: number, n: number): number {
  // A negative exponent is the same power of 1 / x.
  if (n < 0) return myPow(1 / x, -n);
  if (n === 0) return 1;
  // x^n = (x * x)^(n / 2), with one extra x when n is odd.
  const half = myPow(x * x, Math.floor(n / 2));
  return n % 2 === 1 ? half * x : half;
}
