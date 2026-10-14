export function reverseBits(n: number): number {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = ((result << 1) | (n & 1)) >>> 0; // >>> 0 keeps it unsigned
    n >>>= 1;
  }
  return result;
}
