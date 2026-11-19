def shortest_path_binary_matrix(grid: list[list[int]]) -> int:
    n = len(grid)
    if grid[0][0] == 1 or grid[n - 1][n - 1] == 1:
        return -1
    # BFS by levels: every cell of `level` is `length` cells away from the start.
    seen = {(0, 0)}
    level = [(0, 0)]
    length = 1
    while level:
        next_level = []
        for r, c in level:
            if r == n - 1 and c == n - 1:
                return length
            for dr in (-1, 0, 1):
                for dc in (-1, 0, 1):
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0 and (nr, nc) not in seen:
                        seen.add((nr, nc))  # the first visit is the shortest one
                        next_level.append((nr, nc))
        level = next_level
        length += 1
    return -1
