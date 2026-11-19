export function multiplyByDigit(digits: number[], factor: number): number[] {
  const result: number[] = [];
  let carry = 0;
  // Start at the last digit, as on paper.
  for (let i = digits.length - 1; i >= 0; i--) {
    const total = digits[i]! * factor + carry;
    result.push(total % 10);
    carry = Math.floor(total / 10);
  }
  // A last carry becomes a new first digit.
  if (carry > 0) result.push(carry);
  return result.reverse();
}
