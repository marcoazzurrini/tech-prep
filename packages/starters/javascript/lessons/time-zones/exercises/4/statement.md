Write `kickoffTimes(moment, zones)`. `moment` is the start of a match, as ISO text with a `Z` or an offset. `zones` is a list of zone names, such as `"Asia/Tokyo"`.

Return the clock time of the kickoff in each zone, as `"HH:MM"` on a 24-hour clock, in the same order.

Example 1: kickoffTimes("2024-07-14T19:00:00Z", ["Europe/Rome", "Asia/Tokyo"])  ->  ["21:00", "04:00"]
Example 2: kickoffTimes("2024-06-01T12:00:00Z", [])  ->  []
