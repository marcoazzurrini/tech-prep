export class Item {
  static parse(text) {
    const [name, price] = text.split(":");

    return new this(name, Number(price));
  }

  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  line() {
    return `${this.name}: ${this.price}`;
  }
}

export class Drink extends Item {
  refill() {
    return `More ${this.name}`;
  }
}

export class Dish extends Item {
  half() {
    return this.price / 2;
  }
}
