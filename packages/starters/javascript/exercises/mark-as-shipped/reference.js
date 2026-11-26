export function markShipped(orders, id) {
  return orders.map((order) => {
    if (order.id !== id) {
      return order;
    }

    return { ...order, status: "shipped", history: [...order.history, "shipped"] };
  });
}
