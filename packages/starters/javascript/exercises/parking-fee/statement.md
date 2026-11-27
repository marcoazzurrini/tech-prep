# Parking Fee (medium)

Write `parkingFee(entry, exit, rate)`. `entry` and `exit` are exact times, written as strings that end in `Z` or an offset such as `+02:00`. `rate` is the price of one hour.

Every hour that has started costs the full `rate`. Return the fee.

Example 1: parkingFee("2024-05-01T08:00:00Z", "2024-05-01T10:00:00Z", 3)  ->  6
Example 2: parkingFee("2024-05-01T08:00:00Z", "2024-05-01T10:01:00Z", 3)  ->  9
Example 3: parkingFee("2024-05-01T09:30:00+02:00", "2024-05-01T08:00:00Z", 5)  ->  5
  The car came in at 07:30 in UTC and stayed half an hour.

Note: `exit` is never before `entry`.
