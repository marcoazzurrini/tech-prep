export function canCheckOut(cart) {
  return Boolean(cart.items.length && cart.address);
}
