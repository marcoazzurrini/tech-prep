const isPaid = async (order) => order.paid === true;

export function paidOrderIds(orders) {
  return Promise.all(orders.map(isPaid)).then((paid) =>
    orders.filter((order, i) => paid[i]).map((order) => order.id)
  );
}
