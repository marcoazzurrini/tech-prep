# Duplicate a Row (medium)

A table is an array of rows. A row looks like `{ label: "Rent", cells: [900, 900, 950] }`.

Write `duplicateRow(rows, index)`. It returns a new array of rows, in which the row at `index` is followed by a duplicate of it.

The duplicate has the same label and the same cells, but it is separate from the original row. Editing the label or the cells of one must not show in the other.

The function must not change `rows`. Every other row in the result is the very same object as in `rows`.

Example 1:
  duplicateRow([{ label: "Rent", cells: [900] }, { label: "Food", cells: [300] }], 0)
  ->  [{ label: "Rent", cells: [900] }, { label: "Rent", cells: [900] }, { label: "Food", cells: [300] }]

Constraints: `index` is the index of a row in `rows`.
