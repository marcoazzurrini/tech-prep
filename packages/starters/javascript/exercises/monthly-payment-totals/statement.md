# Monthly Payment Totals (medium)

Write `monthlyTotals(payments, zone)`. Each payment is an object with `at`, the exact time it was made, and an `amount`. `at` is a string that ends in `Z` or an offset such as `+02:00`. `zone` is the name of a time zone, such as `"Europe/Berlin"`.

A payment belongs to the month its date falls in, as a clock in `zone` reads it. Return one object per month that has payments, `{ month, total }`, with `month` written as `"YYYY-MM"`. Order them from the earliest month to the latest.

Example 1:
  monthlyTotals([{ at: "2024-03-31T23:30:00Z", amount: 20 }, { at: "2024-03-15T10:00:00Z", amount: 5 }], "Europe/Berlin")
  ->  [{ month: "2024-03", total: 5 }, { month: "2024-04", total: 20 }]
Example 2:
  monthlyTotals([{ at: "2024-03-31T23:30:00Z", amount: 20 }, { at: "2024-03-15T10:00:00Z", amount: 5 }], "UTC")
  ->  [{ month: "2024-03", total: 25 }]
Example 3: monthlyTotals([], "Asia/Tokyo")  ->  []
