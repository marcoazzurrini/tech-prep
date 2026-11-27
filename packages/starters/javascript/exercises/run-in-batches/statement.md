# Run in Batches (medium)

Write `runInBatches(tasks, size)`. Each task is a function that returns a promise.

Start the tasks in batches of `size`: the first `size` tasks together, then the next `size`, and so on. A batch starts only when every task of the batch before has finished.

Return a promise of every result, in the order of `tasks`. If a task rejects, reject with its error.

Example 1: runInBatches([() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)], 2)  ->  [1, 2, 3]
Example 2: runInBatches([], 3)  ->  []
