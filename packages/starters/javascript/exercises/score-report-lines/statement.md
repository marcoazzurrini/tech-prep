# Score Report (medium)

`makeBoard(title)` returns a scoreboard with two methods:

- `add(player, points)` adds points to a player's score.
- `report()` should return one line of text for each player, in the order the players first scored: the board's title, a colon, the player and the score.

The code below throws when `report()` has a line to write. Fix it.

Example 1:
  const board = makeBoard("Cup");
  board.add("Ada", 3);
  board.add("Kim", 1);
  board.add("Ada", 2);
  board.report()  ->  ["Cup: Ada 5", "Cup: Kim 1"]
