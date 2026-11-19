def count_roll_routes(heights: list[list[int]]) -> int:
    rows, cols = len(heights), len(heights[0])
    # memo[r][c] = number of routes from (r, c) until the ball stops. -1 means not solved yet.
    memo = [[-1] * cols for _ in range(rows)]

    def routes(r: int, c: int) -> int:
        if memo[r][c] == -1:
            total = 0
            moved = False
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < rows and 0 <= nc < cols and heights[nr][nc] < heights[r][c]:
                    total += routes(nr, nc)
                    moved = True
            # With no lower neighbour, the ball stops here: one route.
            memo[r][c] = total if moved else 1
        return memo[r][c]

    return routes(0, 0)
