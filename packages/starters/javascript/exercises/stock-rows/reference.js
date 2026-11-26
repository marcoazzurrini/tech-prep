const isShown = (product) => !product.hidden;

const leftOf = (product) => product.count ?? "unknown";

export const stockRows = (products) =>
  products
    .filter(isShown)
    .map((product) => ({ name: product.name, left: leftOf(product) }));
