# Rename Columns (easy)

Write `renameColumns(row, names)`. `row` is an object, and `names` maps an old key to its new name.

Return a new object with the same values. Each key that is in `names` gets its new name, and the other keys stay as they are.

Example 1: renameColumns({ fname: "Ada", age: 36 }, { fname: "firstName" })  ->  { firstName: "Ada", age: 36 }
Example 2: renameColumns({ a: 1, b: 2 }, { a: "b", b: "a" })  ->  { b: 1, a: 2 }
Example 3: renameColumns({ id: 7 }, {})  ->  { id: 7 }
