`cleanRows(grid)` should return the indexes of the rows that hold no negative number.

The code below returns the index of every row: its `continue` only moves on to the next number. Fix it, so that a negative number moves on to the next row.

Example 1: cleanRows([[1, 2], [3, -4], [5, 6]])  ->  [0, 2]
Example 2: cleanRows([[-1], [-2, 3]])  ->  []
