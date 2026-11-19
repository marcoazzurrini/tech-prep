def walls_and_gates(rooms: list[list[int]]) -> None:
    rows, cols = len(rooms), len(rooms[0])
    empty = 2147483647
    # Start the queue with every gate, so the BFS spreads from all of them at once.
    queue = [(r, c) for r in range(rows) for c in range(cols) if rooms[r][c] == 0]
    head = 0
    while head < len(queue):
        r, c = queue[head]
        head += 1
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            # A room that is still empty is reached now for the first time: from its nearest gate.
            if 0 <= nr < rows and 0 <= nc < cols and rooms[nr][nc] == empty:
                rooms[nr][nc] = rooms[r][c] + 1
                queue.append((nr, nc))
