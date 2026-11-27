export class Duration {
  #seconds = 0;

  constructor(seconds) {
    this.seconds = seconds;
  }

  get seconds() {
    return this.#seconds;
  }

  set seconds(value) {
    if (!Number.isInteger(value) || value < 0) {
      throw new RangeError(`Not a whole number of seconds: ${value}`);
    }

    this.#seconds = value;
  }

  get minutes() {
    return this.#seconds / 60;
  }

  set minutes(value) {
    this.seconds = value * 60;
  }

  get label() {
    const minutes = Math.floor(this.#seconds / 60);
    const rest = String(this.#seconds % 60).padStart(2, "0");

    return `${minutes}:${rest}`;
  }
}
