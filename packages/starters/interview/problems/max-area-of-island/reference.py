def max_area_of_island(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    best = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] != 1:
                continue
            # Sink the whole island with a stack and count its cells.
            grid[r][c] = 0
            stack = [(r, c)]
            area = 0
            while stack:
                i, j = stack.pop()
                area += 1
                for ni, nj in ((i + 1, j), (i - 1, j), (i, j + 1), (i, j - 1)):
                    if 0 <= ni < rows and 0 <= nj < cols and grid[ni][nj] == 1:
                        grid[ni][nj] = 0  # mark when pushed, so no cell is counted twice
                        stack.append((ni, nj))
            best = max(best, area)
    return best
