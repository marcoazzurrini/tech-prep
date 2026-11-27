# Shop Open Check (medium)

Write `isShopOpen(moment, shop)`. `moment` is ISO text with a `Z` or an offset, such as `"2024-07-15T07:30:00Z"`. `shop` has a `location`, such as `"Europe/Rome"`, and its opening hours on the clocks of that place, as `"HH:MM"` text.

Return `true` when the shop is open at that moment. It opens at `opens` and closes at `closes`, so a customer at exactly `closes` is too late.

Example 1:
  isShopOpen("2024-07-15T07:30:00Z", { location: "Europe/Rome", opens: "09:00", closes: "18:30" })
  ->  true
Example 2:
  isShopOpen("2024-01-15T07:30:00Z", { location: "Europe/Rome", opens: "09:00", closes: "18:30" })
  ->  false

Note: `closes` is always later than `opens` on the same day.
