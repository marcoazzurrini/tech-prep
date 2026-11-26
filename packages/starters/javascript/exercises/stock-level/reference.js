export function restock(amount) {
  this.stock += amount;

  return this.stock;
}

export function isLow() {
  return this.stock < this.minimum;
}
