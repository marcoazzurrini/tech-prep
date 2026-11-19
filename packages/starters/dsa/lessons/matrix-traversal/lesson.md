# Matrix Index Tricks

Many matrix tasks only move values to new places. Do not think about the picture as a whole. Write down where one cell `(r, c)` goes, as a rule on the two indexes. Then apply that rule in a loop.

## Worked example

Transpose a square matrix in place: rows become columns.

```ts
const m = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// the cell (r, c) swaps with the cell (c, r)
for (let r = 0; r < 3; r++) {
  for (let c = r + 1; c < 3; c++) {
    [m[r][c], m[c][r]] = [m[c][r], m[r][c]];
  }
}

// m is [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
```

## Why it works

- The rule is: `(r, c)` goes to `(c, r)`. The swap line is that rule, written once.
- `c` starts at `r + 1`. So each pair is swapped once. If `c` started at `0`, each pair would swap twice and end where it began.
- Other moves are rules too. Reversing a row sends `c` to `cols - 1 - c`. Reversing the order of the rows sends `r` to `rows - 1 - r`.

## When to use it

- The task says "rotate", "flip", "mirror" or "transpose".
- The task asks for the values in a special order, such as a spiral. Then keep four boundaries (top, bottom, left, right) and move one inwards after each side.
- The task says "in place". Swap pairs of cells, and do not build a second matrix.
