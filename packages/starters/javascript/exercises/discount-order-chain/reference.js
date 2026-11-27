export class Order {
  constructor(prices) {
    this.prices = prices;
  }

  static currency() {
    return "USD";
  }

  get total() {
    return this.prices.reduce((sum, price) => sum + price, 0);
  }

  receipt() {
    return `${this.constructor.currency()} ${this.total}`;
  }
}

export class DiscountedOrder extends Order {
  constructor(prices, percent) {
    super(prices);
    this.percent = percent;
  }

  static currency() {
    return `${super.currency()}-PROMO`;
  }

  get total() {
    return super.total * (1 - this.percent / 100);
  }

  receipt() {
    return `${super.receipt()} (${this.percent}% off)`;
  }
}
