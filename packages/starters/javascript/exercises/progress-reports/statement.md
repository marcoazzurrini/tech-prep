# Progress Reports (medium)

A download reports its progress many times a second. Redrawing the screen for every report is wasteful, but the user must see steady updates and the final value.

Write `steadyReports(show, ms)`. It returns a function `report(percent)`:

- When nothing has been shown in the last `ms` milliseconds, `report` calls `show(percent)` at once.
- Otherwise, it keeps the report. When `ms` have passed since the last `show`, it shows the latest kept report, and the wait starts again. A report that was replaced by a newer one is never shown.

The file also exports `wait(ms)`, for the tests.

Example 1:
  const report = steadyReports(show, 15);
  report(10); report(20); report(30)
  show(10) at once, then show(30) 15 ms later
