# Leaderboard Order (medium)

Write `leaderboardOrder(entries)`. Each entry is `{ name, points, bonus }`, where `bonus` may be `null` or `undefined`.

A player's total is `points` plus `bonus`, using `0` when `bonus` is `null` or `undefined`.

Return a new array of player names from highest total to lowest. When totals tie, put the shorter name first. When name lengths also tie, keep the original order. Do not change `entries`.

Example 1:
  leaderboardOrder([{ name: "Mara", points: 10, bonus: null }, { name: "Bo", points: 5, bonus: 5 }])  ->  ["Bo", "Mara"]
Example 2:
  leaderboardOrder([{ name: "Cy", points: 20, bonus: 0 }, { name: "Jo", points: 20 }])  ->  ["Cy", "Jo"]
Example 3:
  leaderboardOrder([])  ->  []
