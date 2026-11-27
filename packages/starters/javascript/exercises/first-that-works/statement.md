# First That Works (medium)

Write `firstThatWorks(tasks)`. `tasks` is an array of functions that take no arguments.

Call the tasks in order. Return the result of the first one that does not throw, and do not call the tasks after it.

If every task throws, throw what the last task threw. If the array is empty, throw `new Error("no tasks")`.

Example 1: firstThatWorks([() => 1, () => 2])  ->  1
Example 2:
  firstThatWorks([() => { throw new Error("a"); }, () => "b"])  ->  "b"
Example 3:
  firstThatWorks([() => { throw new Error("a"); }, () => { throw new Error("b"); }])
  ->  throws the error with the message "b"
