# One Task at a Time (medium)

Write `makeRunner()`. It returns a function `run(task)` that calls `task()` and returns its result.

A runner runs one task at a time. If `run` is called while a task of the same runner is still running, it throws `new Error("busy")` and does not call the new task. This happens when a task calls `run` itself.

A task that throws must not block the runner. Its error reaches the caller, and the next `run` works as usual. Each runner is separate from the others.

Example 1: run(() => 1)  ->  1
Example 2: run(() => run(() => 2))  ->  throws an error with the message "busy"
Example 3:
  run(() => { throw new Error("x"); })  ->  throws the error "x"
  run(() => "free")  ->  "free"
