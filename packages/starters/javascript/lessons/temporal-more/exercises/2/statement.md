Write `hoursOnDay(date, zone)`. It takes a date written as `"YYYY-MM-DD"` and a time zone name, and returns how many hours that day has in that zone.

Example 1: hoursOnDay("2024-07-01", "Asia/Tokyo")  ->  24
Example 2: hoursOnDay("2024-03-10", "America/New_York")  ->  23
  The clocks in New York went forward one hour that night.
Example 3: hoursOnDay("2024-04-07", "Australia/Lord_Howe")  ->  24.5

Note: `Temporal.ZonedDateTime.from` reads a date with a zone, such as `"2024-07-01[Asia/Tokyo]"`.
