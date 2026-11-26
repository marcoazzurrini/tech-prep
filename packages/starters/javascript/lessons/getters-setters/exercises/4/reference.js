export function createProduct(name, price) {
  return {
    name,
    _price: price,
    get price() {
      return this._price;
    },
    set price(value) {
      if (value < 0) {
        throw new RangeError("Price is negative");
      }

      this._price = value;
    },
  };
}
