# Time per Function (medium)

A profiler records when each function starts and when it ends. Each record is an array: `[time, "start", name]` or `[time, "end"]`. An `"end"` ends the function that started last and has not ended yet.

Only one function runs at a time. While a function waits for one that it called, its clock stops.

Write `ownTimes(records)`. It returns an object that maps the name of each function to the time it spent running itself. When a function runs more than once, add its times up.

Example 1:
  ownTimes([[0, "start", "main"], [2, "start", "load"], [5, "end"], [9, "end"]])
  ->  { main: 6, load: 3 }
Example 2: ownTimes([])  ->  {}

Note: In example 1, `main` runs from 0 to 2, waits while `load` runs, and runs again from 5 to 9.
