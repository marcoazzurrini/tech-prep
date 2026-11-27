# First to Succeed (medium)

Write `firstToSucceed(tasks)`. Each task is a function that returns a promise. Start every task at once.

Return a promise of `{ index, value }` for the first task whose promise fulfils. `index` is the task's place in `tasks`. If every task fails, the promise rejects with an `AggregateError` that holds all the errors.

Example 1: firstToSucceed([() => Promise.reject(new Error("a")), () => Promise.resolve("b")])  ->  { index: 1, value: "b" }
Example 2: firstToSucceed([])  ->  rejects with an AggregateError
