Write the constructor of `MyPromise`.

It sets `this.state` to `"pending"` and `this.value` to `undefined`. Then it calls `executor(resolve, reject)` at once.

- `resolve(value)` sets the state to `"fulfilled"` and the value to `value`.
- `reject(reason)` sets the state to `"rejected"` and the value to `reason`.
- Only the first of these calls counts. Later calls change nothing.
- If the executor throws, reject with the error.

Example 1: new MyPromise((resolve) => resolve(5))  ->  state "fulfilled", value 5
Example 2: new MyPromise(() => { throw new Error("broken"); })  ->  state "rejected", value the error

Note: `wait` is a helper for the tests, at the top of the file.
