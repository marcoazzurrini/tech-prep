const sizeOf = (n) => {
  let size = 1;

  while (n >= 128) {
    n = Math.floor(n / 128);
    size++;
  }

  return size;
};

export function encodeVarints(numbers) {
  const total = numbers.reduce((sum, n) => sum + sizeOf(n), 0);
  const out = new Uint8Array(total);
  let pos = 0;

  for (let n of numbers) {
    while (n >= 128) {
      out[pos++] = (n & 0x7f) | 0x80;
      n >>>= 7;
    }
    out[pos++] = n;
  }

  return out;
}
