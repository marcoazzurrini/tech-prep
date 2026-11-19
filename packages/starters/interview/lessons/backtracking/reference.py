def list_climbs(total: int) -> list[list[int]]:
    result = []
    moves = []

    def backtrack(left: int) -> None:
        if left == 0:
            result.append(moves[:])  # save a copy
            return
        for step in (1, 2):
            if step <= left:
                moves.append(step)  # choose
                backtrack(left - step)
                moves.pop()  # undo

    backtrack(total)
    return result
