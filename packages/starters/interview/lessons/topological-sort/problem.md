# Tasks You Can Finish (easy)

There are `n` tasks, labelled `0` to `n - 1`. Each pair `[a, b]` in `deps` means task `a` must be done before task `b`. A task can be done only after all the tasks before it are done.

Some tasks can never be done: tasks that wait for each other in a cycle, and tasks that wait for such a task. Return the number of tasks that can be done.

Example 1: n = 3, deps = [[0, 1], [1, 2]]  ->  3
Example 2: n = 3, deps = [[0, 1], [1, 0]]  ->  1  (only task 2)
Example 3: n = 4, deps = [[0, 1], [1, 2], [2, 1], [2, 3]]  ->  1  (only task 0; task 3 waits for task 2)

Constraints: 1 <= n <= 1000, 0 <= deps.length <= 5000, a != b, all pairs are distinct.
