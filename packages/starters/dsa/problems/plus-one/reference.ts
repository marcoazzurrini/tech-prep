export function plusOne(digits: number[]): number[] {
  const result = [...digits];
  // Walk from the last digit. A 9 becomes 0 and the carry moves left.
  for (let i = result.length - 1; i >= 0; i--) {
    if (result[i]! < 9) {
      result[i]! += 1;
      return result; // no carry left
    }
    result[i] = 0;
  }
  // Every digit was 9: the number grows by one digit.
  return [1, ...result];
}
