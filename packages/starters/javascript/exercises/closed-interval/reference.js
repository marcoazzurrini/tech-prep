export class Interval {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  static [Symbol.hasInstance](value) {
    return typeof value?.from === "number" && typeof value?.to === "number";
  }

  *[Symbol.iterator]() {
    for (let n = this.from; n <= this.to; n += 1) {
      yield n;
    }
  }

  [Symbol.toPrimitive](hint) {
    if (hint === "string") {
      return `[${this.from}, ${this.to}]`;
    }

    return Math.max(0, this.to - this.from + 1);
  }

  get [Symbol.toStringTag]() {
    return "Interval";
  }
}
