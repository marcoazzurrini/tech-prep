`deadline(start, days)` should return a `Date` that is `days` days after the date `start`.

The code below returns the wrong date. Fix it.

Example 1: deadline(new Date(0), 1).getTime()  ->  86400000
Example 2: deadline(new Date(5000), 2).getTime()  ->  172805000
