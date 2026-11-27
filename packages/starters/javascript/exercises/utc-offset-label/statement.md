# UTC Offset Label (medium)

Write `offsetLabel(minutes)`. It takes a number as `getTimezoneOffset()` returns it, and returns the offset the way people write it: `"UTC"`, a sign, two digits of hours, a colon and two digits of minutes.

Zero is written with a plus sign.

Example 1: offsetLabel(-120)  ->  "UTC+02:00"
Example 2: offsetLabel(300)  ->  "UTC-05:00"
Example 3: offsetLabel(-330)  ->  "UTC+05:30"
Example 4: offsetLabel(0)  ->  "UTC+00:00"
