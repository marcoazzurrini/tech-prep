def is_valid_sudoku(board: list[list[str]]) -> bool:
    seen = set()
    for r in range(9):
        for c in range(9):
            d = board[r][c]
            if d == ".":
                continue
            # One key per rule. Cells of the same box share (r // 3, c // 3).
            keys = [("row", r, d), ("col", c, d), ("box", r // 3, c // 3, d)]
            for key in keys:
                if key in seen:
                    return False
                seen.add(key)
    return True
