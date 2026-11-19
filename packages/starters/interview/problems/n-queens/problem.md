# N-Queens (hard)

Place `n` queens on an `n` by `n` chess board so that no two queens attack each other. A queen attacks every square in its row, its column and its two diagonals. Return every board that works.

Write a board as a list of `n` strings, one per row from top to bottom. In each string, `Q` is a queen and `.` is an empty square. Return the boards in any order.

Example 1: n = 4  ->  [[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]]
Example 2: n = 1  ->  [["Q"]]
Example 3: n = 2  ->  [] (two queens always attack each other on a 2 by 2 board)

Constraints: 1 <= n <= 8.
