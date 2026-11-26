export function createCart() {
  return {
    total: 0,
    add(price) {
      this.total += price;

      return this;
    },
    discount(amount) {
      this.total -= amount;

      return this;
    },
  };
}
