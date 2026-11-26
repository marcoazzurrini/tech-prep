export function restock(products, sku, amount) {
  return products.map((product) => {
    if (product.sku === sku) {
      return { ...product, stock: product.stock + amount };
    }

    return product;
  });
}
