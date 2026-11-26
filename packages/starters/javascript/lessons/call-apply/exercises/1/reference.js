function line(quantity, unit) {
  return `${quantity} ${unit} of ${this.name}`;
}

export function shoppingLine(item, quantity, unit) {
  return line.call(item, quantity, unit);
}
