Write `firstSeats(rows, n)`. `rows` is an iterable of rows such as `{ row: "B", seats: 2 }`. The seats of that row are named `B1` and `B2`.

Return an array of the first `n` seat names, row after row. `rows` can be endless, so read no more rows than you need.

Example 1: firstSeats([{ row: "A", seats: 2 }, { row: "B", seats: 3 }], 4)  ->  ["A1", "A2", "B1", "B2"]
Example 2: firstSeats([{ row: "C", seats: 1 }], 5)  ->  ["C1"]
