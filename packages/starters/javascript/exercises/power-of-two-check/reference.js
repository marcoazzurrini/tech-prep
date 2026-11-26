export function isPowerOfTwo(n) {
  // A power of two has exactly one bit set. Subtracting 1 clears that bit and sets
  // the ones below it, so the two numbers share no bit.
  return n > 0 && (n & (n - 1)) === 0;
}
