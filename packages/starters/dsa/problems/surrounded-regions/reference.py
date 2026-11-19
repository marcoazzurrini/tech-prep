def solve(board: list[list[str]]) -> None:
    rows, cols = len(board), len(board[0])
    # Search from the border: every "O" reached from there is safe. Mark it "S".
    stack = [(r, c) for r in range(rows) for c in range(cols)
             if (r in (0, rows - 1) or c in (0, cols - 1)) and board[r][c] == "O"]
    for r, c in stack:
        board[r][c] = "S"
    while stack:
        r, c = stack.pop()
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] == "O":
                board[nr][nc] = "S"
                stack.append((nr, nc))
    # Every "O" that is left is surrounded. Safe cells turn back into "O".
    for r in range(rows):
        for c in range(cols):
            board[r][c] = "O" if board[r][c] == "S" else "X"
