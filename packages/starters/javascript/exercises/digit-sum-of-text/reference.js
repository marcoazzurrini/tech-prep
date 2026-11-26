export function digitSum(text) {
  let sum = 0;

  for (const digit of text) {
    sum += Number(digit);
  }

  return sum;
}
