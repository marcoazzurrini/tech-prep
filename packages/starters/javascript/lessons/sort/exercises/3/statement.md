Write `rankPlayers(players)`. Each player is `{ name, score, id }`.

Return a new array of player names ordered by `score` from highest to lowest. When two players have the same `score`, put the smaller `id` first.

Do not change `players`.

Example 1:
  rankPlayers([{ name: "Ada", score: 50, id: 2 }, { name: "Bo", score: 50, id: 1 }, { name: "Cy", score: 80, id: 3 }])  ->  ["Cy", "Bo", "Ada"]
Example 2:
  rankPlayers([])  ->  []
