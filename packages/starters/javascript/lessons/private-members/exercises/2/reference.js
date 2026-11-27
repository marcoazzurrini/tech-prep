export class Thermostat {
  static #made = 0;

  #target;

  constructor(target) {
    Thermostat.#made += 1;
    this.#target = this.#clamp(target);
  }

  #clamp(value) {
    return Math.min(30, Math.max(10, value));
  }

  set(value) {
    this.#target = this.#clamp(value);

    return this.#target;
  }

  target() {
    return this.#target;
  }

  static made() {
    return Thermostat.#made;
  }
}
