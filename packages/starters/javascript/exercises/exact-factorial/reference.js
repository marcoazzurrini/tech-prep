export function factorial(n) {
  let product = 1n;

  for (let i = 2; i <= n; i += 1) {
    product *= BigInt(i);
  }

  return product;
}
