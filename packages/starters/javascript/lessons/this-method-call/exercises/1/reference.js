export function makeTicket(price, quantity) {
  return {
    price,
    quantity,
    total() {
      return this.price * this.quantity;
    },
  };
}
