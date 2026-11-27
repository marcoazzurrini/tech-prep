`award` is handed to other code as a callback, as in `[5, 10].forEach(board.award)`. That call throws, because `award` loses its `this`.

Change the class so that `award` works however it is called.

Example 1:
  const board = new Scoreboard();
  const { award } = board;
  award(5)  ->  5
  award(10)  ->  15
  board.points  ->  15
