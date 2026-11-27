# All Before the Deadline (medium)

Write `allBeforeDeadline(tasks, ms)`. Each task is a function that returns a promise or a plain value. Start every task at once.

Return a promise of all their values, in the order of `tasks`. If a task rejects, reject with its error. If the values are not all in after `ms` milliseconds, reject with `new Error("deadline passed")`.

Example 1: two tasks that give "a" after 10 ms and "b" after 5 ms, with ms = 40  ->  ["a", "b"]
Example 2: a task that gives "b" after 50 ms, with ms = 20  ->  rejects with "deadline passed"
Example 3: allBeforeDeadline([], 20)  ->  []
