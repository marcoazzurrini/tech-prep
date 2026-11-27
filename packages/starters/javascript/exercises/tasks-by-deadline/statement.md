# Tasks by Deadline (easy)

Write `tasksByDeadline(tasks)`. Each task is `{ title, daysLeft }`.

Return a new array of titles ordered from fewest `daysLeft` to most. Keep the original order when two tasks have the same `daysLeft`. Do not change `tasks`.

Example 1:
  tasksByDeadline([{ title: "tax", daysLeft: 10 }, { title: "rent", daysLeft: 2 }, { title: "gym", daysLeft: 2 }])  ->  ["rent", "gym", "tax"]
Example 2:
  tasksByDeadline([])  ->  []
