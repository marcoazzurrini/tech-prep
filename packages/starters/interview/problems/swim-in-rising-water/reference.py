import heapq


def swim_in_water(grid: list[list[int]]) -> int:
    n = len(grid)
    seen = {(0, 0)}
    # (time needed to stand in the cell, row, col)
    heap = [(grid[0][0], 0, 0)]
    while heap:
        # The cell that can be reached at the earliest time.
        time, r, c = heapq.heappop(heap)
        if r == n - 1 and c == n - 1:
            return time
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in seen:
                seen.add((nr, nc))
                # A path costs its highest cell, not the sum of its cells.
                heapq.heappush(heap, (max(time, grid[nr][nc]), nr, nc))
    return -1
