# Seat Chart (medium)

Write `makeSeatChart(rows, cols, taken)`.

Return a grid with `rows` rows and `cols` columns, where every seat starts as `"open"`. `taken` is an array of `[row, col]` pairs. Mark each seat listed in `taken` as `"taken"`.

Ignore any pair outside the grid.

Example 1: makeSeatChart(2, 3, [[0, 1], [1, 2]])  ->  [["open", "taken", "open"], ["open", "open", "taken"]]
Example 2: makeSeatChart(2, 2, [[5, 0], [-1, 1]])  ->  [["open", "open"], ["open", "open"]]
Example 3: makeSeatChart(0, 3, [[0, 0]])  ->  []
