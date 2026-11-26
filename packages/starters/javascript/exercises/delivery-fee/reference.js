export function deliveryFee(order) {
  const weight = order.items * order.itemWeight + (order.boxWeight ?? 1);
  const free = (order.member || order.total > 50) && !order.express;

  return free ? 0 : 4 + weight * 2;
}
