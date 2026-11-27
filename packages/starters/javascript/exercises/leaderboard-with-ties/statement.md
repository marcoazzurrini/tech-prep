# Leaderboard with Ties (medium)

Write `leaderboard(players)`. Each player is an object `{ name, score }`, where `score` is a number.

Return an array of `[score, names]` pairs, one for each different score, from the highest score to the lowest. `score` must stay a number. `names` lists the players with that score, in the order they appear.

Example 1:
  leaderboard([{ name: "Ada", score: 9 }, { name: "Bo", score: 7 }, { name: "Cy", score: 9 }])
  ->  [[9, ["Ada", "Cy"]], [7, ["Bo"]]]
Example 2: leaderboard([])  ->  []
