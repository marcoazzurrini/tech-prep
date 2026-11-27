export class Ticket {
  constructor(event, price) {
    this.event = event;
    this.price = price;
  }

  static prefix() {
    return "TICKET";
  }

  summary() {
    return `${this.event}: $${this.price}`;
  }
}

export class VipTicket extends Ticket {
  constructor(event, price, lounge) {
    super(event, price);
    this.lounge = lounge;
  }

  static prefix() {
    return `${super.prefix()}-VIP`;
  }

  summary() {
    return `${super.summary()} [VIP: ${this.lounge}]`;
  }
}
