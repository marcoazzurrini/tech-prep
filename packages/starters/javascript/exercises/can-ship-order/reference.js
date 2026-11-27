export function canShipOrder(warehouse, orderLines) {
  if (orderLines.length === 0) {
    return false;
  }

  return orderLines.every(({ sku, needed }) => {
    const stock = warehouse.find((item) => item.sku === sku);
    return (stock?.qty ?? -1) >= needed;
  });
}
