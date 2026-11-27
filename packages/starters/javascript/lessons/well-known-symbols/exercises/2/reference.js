export class PositiveNumber {
  static [Symbol.hasInstance](value) {
    return typeof value === "number" && value > 0;
  }
}
