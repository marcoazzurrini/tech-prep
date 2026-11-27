# Highest Score by Team (medium)

Write `highestScoreByTeam(players)`.

Each player has a `score` number (which may be `0` or negative) and an optional `team` string. When `team` is `null` or `undefined`, use `"unassigned"`.

Return an object mapping each team name to the highest `score` on that team.

Example 1: highestScoreByTeam([{ team: "red", score: 10 }, { team: "red", score: 25 }, { team: "blue", score: 15 }])  ->  { red: 25, blue: 15 }
Example 2: highestScoreByTeam([{ team: null, score: -5 }, { score: -2 }])  ->  { unassigned: -2 }
Example 3: highestScoreByTeam([])  ->  {}
