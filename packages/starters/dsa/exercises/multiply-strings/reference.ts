export function multiply(num1: string, num2: string): string {
  if (num1 === "0" || num2 === "0") return "0";
  // The product of digit i and digit j lands on position i + j + 1. Its carry goes to i + j.
  const digits = new Array<number>(num1.length + num2.length).fill(0);
  for (let i = num1.length - 1; i >= 0; i--) {
    for (let j = num2.length - 1; j >= 0; j--) {
      const total = Number(num1[i]) * Number(num2[j]) + digits[i + j + 1]!;
      digits[i + j + 1] = total % 10;
      digits[i + j]! += Math.floor(total / 10);
    }
  }
  // The first position stays 0 when the product has one digit less.
  const start = digits[0] === 0 ? 1 : 0;
  return digits.slice(start).join("");
}
