export class Bag {
  #counts = new Map();

  add(item) {
    this.#counts.set(item, (this.#counts.get(item) ?? 0) + 1);
    return this;
  }

  get size() {
    let total = 0;

    for (const count of this.#counts.values()) {
      total += count;
    }

    return total;
  }

  *[Symbol.iterator]() {
    for (const [item, count] of this.#counts) {
      for (let i = 0; i < count; i += 1) {
        yield item;
      }
    }
  }

  [Symbol.toPrimitive](hint) {
    if (hint === "number") {
      return this.size;
    }

    return this.size === 1 ? "1 item" : `${this.size} items`;
  }

  get [Symbol.toStringTag]() {
    return "Bag";
  }
}
