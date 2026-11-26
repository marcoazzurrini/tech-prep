# Missing Columns (easy)

Write `missingColumns(row, columns)`. `row` is an object read from a spreadsheet, and `columns` lists the column names it should have.

Return the names that the row does not have, in the same order.

An empty cell is still a cell: a column whose value is `""`, `0`, `null` or `undefined` is there. A column can have any name.

Example 1: missingColumns({ name: "Ada", age: 0 }, ["name", "age", "email"])  ->  ["email"]
Example 2: missingColumns({ name: undefined }, ["name"])  ->  []
Example 3: missingColumns({ id: 1 }, ["id", "valueOf"])  ->  ["valueOf"]
