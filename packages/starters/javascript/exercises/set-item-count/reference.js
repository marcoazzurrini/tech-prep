export function setCount(cart, sku, count) {
  if (count === 0) {
    return { ...cart, items: cart.items.filter((item) => item.sku !== sku) };
  }

  if (!cart.items.some((item) => item.sku === sku)) {
    return { ...cart, items: [...cart.items, { sku, count }] };
  }

  return {
    ...cart,
    items: cart.items.map((item) => (item.sku === sku ? { ...item, count } : item)),
  };
}
