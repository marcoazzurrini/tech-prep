def can_reach_border(grid: list[list[int]], row: int, col: int) -> bool:
    rows, cols = len(grid), len(grid[0])
    seen = [[False] * cols for _ in range(rows)]

    def dfs(r: int, c: int) -> bool:
        # Stop on a wall or on a cell we have seen.
        if grid[r][c] == 1 or seen[r][c]:
            return False
        seen[r][c] = True  # mark before recursing
        if r == 0 or r == rows - 1 or c == 0 or c == cols - 1:
            return True
        # Not on the border, so all four neighbours are inside the grid.
        return dfs(r + 1, c) or dfs(r - 1, c) or dfs(r, c + 1) or dfs(r, c - 1)

    return dfs(row, col)
