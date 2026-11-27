export class Slider {
  #value;

  constructor(min, max) {
    this.min = min;
    this.max = max;
    this.#value = min;
  }

  get value() {
    return this.#value;
  }

  set value(next) {
    if (next < this.min || next > this.max) {
      throw new RangeError(`${next} is outside ${this.min} to ${this.max}`);
    }

    this.#value = next;
  }

  get percent() {
    return ((this.#value - this.min) / (this.max - this.min)) * 100;
  }
}
