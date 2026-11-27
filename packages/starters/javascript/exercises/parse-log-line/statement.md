# Parse a Log Line (medium)

Write `parseLogLine(line)`. A log line has a level in square brackets, a space, a date, a space and a message.

- The level is `ERROR`, `WARN` or `INFO`.
- The date is four digits, a dash, two digits, a dash and two digits.
- The message is at least one character, up to the end of the line.

Return `{ level, date, message }`. Return `null` when the line does not have this shape.

Example 1: parseLogLine("[ERROR] 2025-03-14 Disk full")  ->  { level: "ERROR", date: "2025-03-14", message: "Disk full" }
Example 2: parseLogLine("[DEBUG] 2025-01-02 Loop")  ->  null
Example 3: parseLogLine("[WARN] 2025-1-02 Low memory")  ->  null
