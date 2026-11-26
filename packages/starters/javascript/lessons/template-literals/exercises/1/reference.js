export function orderLine(item) {
  return `${item.count} x ${item.name} = ${item.count * item.price}`;
}
