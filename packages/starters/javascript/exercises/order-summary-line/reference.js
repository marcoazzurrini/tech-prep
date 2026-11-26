export function orderSummary(order) {
  const name = (order.customer && order.customer.name) || "Guest";
  const tip = order.tip === undefined ? 10 : order.tip;

  return `${name}, tip ${tip}%`;
}
