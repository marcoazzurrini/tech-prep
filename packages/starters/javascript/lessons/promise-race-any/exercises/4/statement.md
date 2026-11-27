`explainFailure(promises)` gives the first value to fulfil. When every promise rejects, it should reject with a plain `Error` whose message lists all the messages, in input order: `"failed: "` and then the messages, joined with `", "`.

The code below rejects with an `AggregateError` instead. Fix it.

Example 1: explainFailure([Promise.reject(new Error("x")), Promise.resolve("ok")])  ->  "ok"
Example 2: explainFailure([Promise.reject(new Error("x")), Promise.reject(new Error("y"))])  ->  rejects with "failed: x, y"
