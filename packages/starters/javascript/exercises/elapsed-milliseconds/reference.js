const NS_PER_MS = 1_000_000n;

export function elapsedMs(start, end) {
  return Number((BigInt(end) - BigInt(start)) / NS_PER_MS);
}
