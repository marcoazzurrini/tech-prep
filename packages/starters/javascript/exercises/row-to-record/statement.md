# Row to Record (easy)

Write `rowToRecord(headers, cells)`. It takes the header row of a table and one row of cells. It returns an object that maps each header to the cell in the same position.

A header with no cell gets `null`. When a header appears twice, the later cell wins.

Example 1: rowToRecord(["name", "age"], ["Ada", 36])  ->  { name: "Ada", age: 36 }
Example 2: rowToRecord(["id", "city"], [7])  ->  { id: 7, city: null }
Example 3: rowToRecord([2024, 2025], [10, 20])  ->  { "2024": 10, "2025": 20 }
