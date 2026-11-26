Write `updateTask(task, changes)`. It returns a new object: the task with the changes applied.

The `id` of a task never changes, even when `changes` holds an `id`. The function must not change `task`.

Example 1: updateTask({ id: 1, title: "Buy milk", done: false }, { done: true })  ->  { id: 1, title: "Buy milk", done: true }
Example 2: updateTask({ id: 1, title: "Buy milk" }, { id: 99, title: "Buy tea" })  ->  { id: 1, title: "Buy tea" }
