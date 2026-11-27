// For the tests: wait(ms) fulfils after ms. wait() lets every queued callback run first.
export const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const isThenable = (value) =>
  value !== null && (typeof value === "object" || typeof value === "function") && typeof value.then === "function";

export class Slot {
  #state = "empty";
  #value = undefined;
  #waiting = [];

  #settle(state, value) {
    if (this.#state !== "empty") {
      return;
    }
    this.#state = state;
    this.#value = value;
    this.#waiting.forEach((callback) => queueMicrotask(callback));
    this.#waiting = [];
  }

  #follow(value) {
    if (!isThenable(value)) {
      this.#settle("filled", value);
      return;
    }
    queueMicrotask(() => {
      try {
        value.then(
          (inner) => this.#follow(inner),
          (error) => this.#settle("failed", error)
        );
      } catch (error) {
        this.#settle("failed", error);
      }
    });
  }

  fill(value) {
    this.#settle("filled", value);
  }

  fail(error) {
    this.#settle("failed", error);
  }

  then(onFilled, onFailed) {
    const next = new Slot();
    const handle = () => {
      const filled = this.#state === "filled";
      const callback = filled ? onFilled : onFailed;
      if (typeof callback !== "function") {
        if (filled) {
          next.fill(this.#value);
        } else {
          next.fail(this.#value);
        }
        return;
      }
      try {
        next.#follow(callback(this.#value));
      } catch (error) {
        next.fail(error);
      }
    };

    if (this.#state === "empty") {
      this.#waiting.push(handle);
    } else {
      queueMicrotask(handle);
    }
    return next;
  }
}
