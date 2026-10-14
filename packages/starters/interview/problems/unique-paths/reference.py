def unique_paths(m: int, n: int) -> int:
    # row[j] = paths to cell (i, j); the cell above is row[j], the cell to the left is row[j - 1].
    row = [1] * n
    for _ in range(1, m):
        for j in range(1, n):
            row[j] += row[j - 1]
    return row[-1]
