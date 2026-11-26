export function discountFor(order, customer) {
  return order.discount ?? customer.discount ?? 0;
}
