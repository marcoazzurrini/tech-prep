# Longest Streak (medium)

A study log is an array of days in order. Each day looks like `{ day, minutes }`.

Write `longestStreak(log, goal)`. A day meets the goal when its `minutes` are at least `goal`. It returns the length of the longest run of days in a row that all meet the goal.

Example 1:
  longestStreak([{ day: "Mon", minutes: 30 }, { day: "Tue", minutes: 40 }, { day: "Wed", minutes: 5 }], 30)  ->  2
Example 2: longestStreak([{ day: "Mon", minutes: 5 }], 10)  ->  0
Example 3: longestStreak([], 10)  ->  0
