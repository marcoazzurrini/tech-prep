# Move a Card (medium)

A task board is an object. Each key is a column name, and each value is an array of card names.

Write `moveCard(board, from, index, to)`. It takes the card at `index` in column `from` and puts it at the end of column `to`. It returns a new board.

Do not change `board` or any of its arrays. A column that the move does not touch should be the same array in the new board.

Example 1: moveCard({ todo: ["a", "b"], done: [] }, "todo", 0, "done")  ->  { todo: ["b"], done: ["a"] }
Example 2: moveCard({ todo: ["a", "b", "c"] }, "todo", 0, "todo")  ->  { todo: ["b", "c", "a"] }

Constraints: both columns exist, and `index` is a valid index of column `from`.
