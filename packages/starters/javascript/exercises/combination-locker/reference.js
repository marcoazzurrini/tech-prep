export class Locker {
  #code;
  #failures = 0;

  constructor(code) {
    this.#code = code;
  }

  isBlocked() {
    return this.#failures >= 3;
  }

  open(guess) {
    if (this.isBlocked()) {
      return false;
    }

    if (guess !== this.#code) {
      this.#failures += 1;

      return false;
    }

    this.#failures = 0;

    return true;
  }

  changeCode(oldCode, newCode) {
    if (!this.open(oldCode)) {
      return false;
    }

    this.#code = newCode;

    return true;
  }
}
