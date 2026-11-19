def count_reachable_cells(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    reach = [[False] * cols for _ in range(rows)]
    count = 0
    for r in range(rows):
        for c in range(cols):
            # An open cell is reachable if it is the start, or its top or left cell is reachable.
            top = r > 0 and reach[r - 1][c]
            left = c > 0 and reach[r][c - 1]
            reach[r][c] = grid[r][c] == 0 and (r + c == 0 or top or left)
            if reach[r][c]:
                count += 1
    return count
