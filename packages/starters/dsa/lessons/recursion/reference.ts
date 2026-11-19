export function digitSum(n: number): number {
  // Base case: one digit is its own sum.
  if (n < 10) return n;
  // The last digit, plus the same question for the other digits.
  return (n % 10) + digitSum(Math.floor(n / 10));
}
