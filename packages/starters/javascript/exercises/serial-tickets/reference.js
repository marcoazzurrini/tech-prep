export class Ticket {
  static count = 0;

  cancelled = false;

  constructor(holder) {
    Ticket.count += 1;
    this.id = Ticket.count;
    this.holder = holder;
  }

  static issued() {
    return this.count;
  }

  static reset() {
    this.count = 0;
  }

  static fromBatch(holders) {
    return holders.map((holder) => new this(holder));
  }

  cancel = () => {
    this.cancelled = true;
  };
}
