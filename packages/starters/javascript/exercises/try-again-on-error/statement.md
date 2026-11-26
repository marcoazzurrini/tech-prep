# Try Again (medium)

Write `withRetries(fn, attempts)`. It returns a function that calls `fn` with the same `this` and the same arguments it gets, and returns the result.

When `fn` throws, the function calls it again, up to `attempts` calls in all. When the last of them throws too, the function throws that last error.

Example 1:
  let calls = 0;
  const flaky = () => { calls += 1; if (calls < 3) throw new Error("busy"); return "done"; };
  const steady = withRetries(flaky, 5);
  steady()  ->  "done"
  calls  ->  3

Constraints: `attempts` is 1 or more.
