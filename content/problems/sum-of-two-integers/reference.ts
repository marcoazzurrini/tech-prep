export function getSum(a: number, b: number): number {
  // JS bitwise ops already work on 32-bit signed integers.
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}
