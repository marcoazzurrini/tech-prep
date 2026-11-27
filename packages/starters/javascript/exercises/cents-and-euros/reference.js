export class Price {
  #cents = 0;

  constructor(cents) {
    this.cents = cents;
  }

  static get zero() {
    return new Price(0);
  }

  get cents() {
    return this.#cents;
  }

  set cents(value) {
    if (!Number.isInteger(value) || value < 0) {
      throw new RangeError(`Not a whole number of cents: ${value}`);
    }

    this.#cents = value;
  }

  get euros() {
    return this.#cents / 100;
  }

  set euros(value) {
    this.cents = Math.round(value * 100);
  }

  toJSON() {
    return { cents: this.cents, euros: this.euros };
  }
}
