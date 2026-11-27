`runLimited(tasks, limit)` runs the tasks with at most `limit` at once, and gives their results in order. When a task fails, it rejects with that error.

But after a failure, the other workers still start new tasks. Fix it, so that no task starts after one has failed. Tasks that are already running may finish.

Example 1: runLimited([t.job("a", 30), t.job("b", 5), t.job("c", 5)], 2)  ->  ["a", "b", "c"]
Example 2: runLimited([t.job("a", 30), t.fail("b", 5), t.job("c", 5)], 2)  ->  rejects with "b failed", and "c" never starts

Note: `tracker` and `wait` are helpers for the tests, at the top of the file.
