# CSV Line (medium)

Write `csvLine(values)`. It takes an array that holds text, numbers, booleans and `null`. It returns one line of a CSV file: each value as text, with a comma between two values.

- `null` becomes an empty cell.
- Text that contains a comma is wrapped in double quotes.

Example 1: csvLine(["Ada", 36, true])  ->  "Ada,36,true"
Example 2: csvLine(["Ada", null, "London, UK"])  ->  'Ada,,"London, UK"'
Example 3: csvLine([])  ->  ""
