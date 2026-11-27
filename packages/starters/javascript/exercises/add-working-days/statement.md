# Add Working Days (medium)

Write `addWorkingDays(day, count)`. It takes a date written as `"YYYY-MM-DD"` and returns the date `count` working days later, in the same form. Working days are Monday to Friday. Saturday and Sunday do not count.

With a `count` of 0, return the same date.

Example 1: addWorkingDays("2024-05-03", 1)  ->  "2024-05-06"
  3 May 2024 is a Friday, so the next working day is Monday.
Example 2: addWorkingDays("2024-05-04", 1)  ->  "2024-05-06"
Example 3: addWorkingDays("2024-05-06", 5)  ->  "2024-05-13"

Note: `count` is a whole number, 0 or more.
