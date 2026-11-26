export function stockEntry(product, count) {
  return {
    [product]: count,
    [`${product}Low`]: count < 5,
  };
}
