// For the tests: wait(ms) fulfils after ms. wait() lets every queued callback run first.
export const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const isThenable = (value) =>
  value !== null && (typeof value === "object" || typeof value === "function") && typeof value.then === "function";

export class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.callbacks = [];

    const settle = (state, value) => {
      if (this.state !== "pending") {
        return;
      }
      this.state = state;
      this.value = value;
      this.callbacks.forEach((callback) => queueMicrotask(callback));
      this.callbacks = [];
    };

    const follow = (value) => {
      if (value === this) {
        settle("rejected", new TypeError("a promise cannot follow itself"));
        return;
      }
      if (!isThenable(value)) {
        settle("fulfilled", value);
        return;
      }
      queueMicrotask(() => {
        try {
          value.then(follow, (reason) => settle("rejected", reason));
        } catch (error) {
          settle("rejected", error);
        }
      });
    };

    let resolved = false;
    const resolve = (value) => {
      if (!resolved) {
        resolved = true;
        follow(value);
      }
    };
    const reject = (reason) => {
      if (!resolved) {
        resolved = true;
        settle("rejected", reason);
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handle = () => {
        const fulfilled = this.state === "fulfilled";
        const callback = fulfilled ? onFulfilled : onRejected;
        if (typeof callback !== "function") {
          if (fulfilled) {
            resolve(this.value);
          } else {
            reject(this.value);
          }
          return;
        }
        try {
          resolve(callback(this.value));
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === "pending") {
        this.callbacks.push(handle);
      } else {
        queueMicrotask(handle);
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally();
        return value;
      },
      (reason) => {
        onFinally();
        throw reason;
      }
    );
  }
}
