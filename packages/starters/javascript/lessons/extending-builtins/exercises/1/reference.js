export class NumberList extends Array {
  sum() {
    return this.reduce((total, n) => total + n, 0);
  }

  average() {
    return this.length === 0 ? 0 : this.sum() / this.length;
  }
}
