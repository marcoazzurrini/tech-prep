def num_islands(grid: list[list[str]]) -> int:
    rows, cols = len(grid), len(grid[0])
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] != "1":
                continue
            count += 1
            # Sink the whole island with an explicit stack (no recursion limit).
            grid[r][c] = "0"
            stack = [(r, c)]
            while stack:
                i, j = stack.pop()
                for ni, nj in ((i + 1, j), (i - 1, j), (i, j + 1), (i, j - 1)):
                    if 0 <= ni < rows and 0 <= nj < cols and grid[ni][nj] == "1":
                        grid[ni][nj] = "0"
                        stack.append((ni, nj))
    return count
