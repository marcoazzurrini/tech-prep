`createQueue(limit)` returns a queue. `queue.add(task)` runs the task when fewer than `limit` tasks are running, and returns a promise of its result.

It works until a task rejects. After that, the queue never starts another task. Fix it.

Example 1: createQueue(2), then add t.job("a", 30), t.job("b", 5) and t.job("c", 5)  ->  "c" starts when "b" ends
Example 2: createQueue(1), then add t.fail("a", 5) and t.job("b", 5)  ->  "b" still runs after "a" fails

Note: `tracker` and `wait` are helpers for the tests, at the top of the file.
