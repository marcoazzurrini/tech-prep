export function subtractWithoutMinus(a: number, b: number): number {
  while (b !== 0) {
    // A column borrows when a has 0 and b has 1. The borrow moves one column left.
    const borrow = (~a & b) << 1;
    // XOR subtracts each column without borrowing.
    a = a ^ b;
    b = borrow;
  }
  return a;
}
