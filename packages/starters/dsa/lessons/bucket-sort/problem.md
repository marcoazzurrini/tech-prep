# Rank Players by Wins (easy)

`wins[i]` is the number of games that player `i` won. No player won more than `len(wins)` games. Return the player indices, ordered from the most wins to the fewest. Players with equal wins are ordered by index, smaller index first.

Do not call a sort function. Use the number of wins as an index into an array of buckets.

Example 1: wins = [1, 3, 0, 3] -> [1, 3, 0, 2] Example 2: wins = [2, 2, 2] -> [0, 1, 2] Example 3: wins = [] -> []

Constraints: 0 <= len(wins) <= 10^4, 0 <= wins[i] <= len(wins).
