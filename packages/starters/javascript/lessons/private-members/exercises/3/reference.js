export class Money {
  #cents;

  constructor(cents) {
    this.#cents = cents;
  }

  equals(other) {
    return Money.isMoney(other) && this.#cents === other.#cents;
  }

  static isMoney(value) {
    return typeof value === "object" && value !== null && #cents in value;
  }
}
