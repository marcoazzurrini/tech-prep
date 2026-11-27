export function createMoney(amount, currency) {
  return {
    amount,
    currency,
    toJSON() {
      return `${this.amount} ${this.currency}`;
    },
  };
}
