export function roundUpToPowerOfTwo(n) {
  return 2 ** (32 - Math.clz32(n - 1));
}
