A server sends times in UTC, written as a date, a space and a time, such as `"2024-05-01 09:30"`. The text has no `Z`.

Write `parseServerTime(text)`. It returns the milliseconds since 1970 of that moment. The result must be the same on a computer in any time zone.

Example 1: parseServerTime("1970-01-01 00:00")  ->  0
Example 2: parseServerTime("2024-05-01 09:30")  ->  1714555800000
