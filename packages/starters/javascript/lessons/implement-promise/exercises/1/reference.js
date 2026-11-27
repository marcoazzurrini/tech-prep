// For the tests: wait(ms) fulfils after ms. wait() lets every queued callback run first.
export const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

export class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;

    const settle = (state, value) => {
      if (this.state !== "pending") {
        return;
      }
      this.state = state;
      this.value = value;
    };

    const resolve = (value) => settle("fulfilled", value);
    const reject = (reason) => settle("rejected", reason);

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
}
