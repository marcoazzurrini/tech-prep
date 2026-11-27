export function shippingLabels(orders) {
  return orders
    .filter((order) => order.paid && order.address?.city)
    .map((order) => `#${order.id} to ${order.address.city.toUpperCase()}`);
}
