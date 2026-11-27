export class Counter {
  constructor(start = 0) {
    this.value = start;
  }

  static from(start) {
    return new this(start);
  }

  increment(step = 1) {
    this.value += step;
    return this.value;
  }

  reset() {
    this.value = 0;
  }
}

export class LoggedCounter extends Counter {
  constructor(start = 0) {
    super(start);
    this.history = [this.value];
  }

  increment(step = 1) {
    const next = super.increment(step);
    this.history.push(next);
    return next;
  }

  reset() {
    super.reset();
    this.history.push(this.value);
  }
}
