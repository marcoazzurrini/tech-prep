# First Scores (medium)

Write `firstScores(entries)`. Each entry is `{ team, player, score }`. It returns an object that maps each team to an object, and that object maps each player of the team to a score.

A player may appear more than once in a team. Keep the player's first score and ignore the later ones. A score may be `0`.

Example 1:
  firstScores([
    { team: "red", player: "Ada", score: 0 },
    { team: "red", player: "Ada", score: 7 },
    { team: "blue", player: "Bo", score: 3 }
  ])
  ->  { red: { Ada: 0 }, blue: { Bo: 3 } }
Example 2: firstScores([])  ->  {}
