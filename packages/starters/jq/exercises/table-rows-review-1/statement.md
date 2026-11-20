Print each row of the report as one line, with a tab between its values.

Use the `-r` flag, so that jq prints plain text. The rows are in `rows`. Each row is already an array. Strings have no quotes. `@tsv` makes one line from one row, so hand it the rows one at a time.
