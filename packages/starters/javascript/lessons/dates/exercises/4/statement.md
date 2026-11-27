Write `toTimestamp(text)`. It reads a date in the ISO form and returns its milliseconds since 1970. When the text cannot be read as a date, it returns `null`.

Example 1: toTimestamp("1970-01-01")  ->  0
Example 2: toTimestamp("2024-01-15")  ->  1705276800000
Example 3: toTimestamp("hello")  ->  null
