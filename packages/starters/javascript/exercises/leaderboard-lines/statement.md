# Leaderboard Lines (hard)

Write `leaderboard(players)`. Each player is an object with a `name` and a whole number of `points`. Return one line per player, from the most points to the fewest, in American English (`en-US`).

Each line has the place (1st, 2nd, 3rd, 4th and so on), the name, and the points with commas between thousands. Write "1 point", but "0 points" and "2 points".

Players with the same points are ordered by name, as an English dictionary orders words: ignore case, and put an accented letter next to its plain letter.

Example 1:
  leaderboard([{ name: "Ben", points: 1200 }, { name: "Ada", points: 12500 }])
  ->  ["1st Ada: 12,500 points", "2nd Ben: 1,200 points"]
Example 2:
  leaderboard([{ name: "Kim", points: 1 }])
  ->  ["1st Kim: 1 point"]
