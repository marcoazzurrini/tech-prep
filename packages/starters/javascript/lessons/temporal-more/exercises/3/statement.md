Write `dueDates(firstMonth, day, count)`. A bill is due on the same `day` of every month, starting in `firstMonth`, written as `"YYYY-MM"`. Return the first `count` due dates, as `"YYYY-MM-DD"` strings.

When a month is too short for `day`, the bill is due on the last day of that month.

Example 1: dueDates("2024-05", 10, 3)  ->  ["2024-05-10", "2024-06-10", "2024-07-10"]
Example 2: dueDates("2024-01", 31, 3)  ->  ["2024-01-31", "2024-02-29", "2024-03-31"]
