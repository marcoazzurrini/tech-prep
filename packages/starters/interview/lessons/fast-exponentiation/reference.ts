export function powerMod(base: number, exponent: number, mod: number): number {
  if (exponent === 0) return 1 % mod;
  // base^exponent = (base * base)^(exponent / 2), with one extra base when exponent is odd.
  const half = powerMod((base * base) % mod, Math.floor(exponent / 2), mod);
  return exponent % 2 === 1 ? (half * base) % mod : half;
}
