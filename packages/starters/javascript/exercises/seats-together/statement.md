# Seats Together (medium)

Write `seatsTogether(rows, size)`. It finds seats for a group in a cinema.

`rows` is a list of strings, one for each row. In a string, `"."` is a free seat and `"x"` is a taken seat. The group needs `size` free seats side by side, all in one row.

Read the rows from first to last, and each row from left to right. Return `[row, seat]` for the first place that fits: the index of the row, and the index of the group's first seat. Return `null` when no place fits.

Example 1: seatsTogether(["x..x", "...."], 3)  ->  [1, 0]
Example 2: seatsTogether(["..x...x"], 3)  ->  [0, 3]
Example 3: seatsTogether(["x.x", ".x."], 2)  ->  null

Constraints: `size` is at least 1.
