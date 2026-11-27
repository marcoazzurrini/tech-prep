export async function readOrder(text) {
  const order = JSON.parse(text);
  return order.items.length;
}
