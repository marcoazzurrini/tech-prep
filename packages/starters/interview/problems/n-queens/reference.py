def solve_n_queens(n: int) -> list[list[str]]:
    result = []
    queens = []  # queens[row] is the column of the queen in that row
    cols, diags, antis = set(), set(), set()

    def backtrack(row: int) -> None:
        if row == n:
            result.append(["." * c + "Q" + "." * (n - c - 1) for c in queens])
            return
        for col in range(n):
            # row - col names one diagonal, row + col names the other.
            if col in cols or row - col in diags or row + col in antis:
                continue  # attacked: do not go down this branch
            cols.add(col)
            diags.add(row - col)
            antis.add(row + col)
            queens.append(col)
            backtrack(row + 1)
            queens.pop()
            cols.remove(col)
            diags.remove(row - col)
            antis.remove(row + col)

    backtrack(0)
    return result
