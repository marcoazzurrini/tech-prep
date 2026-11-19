def max_coins(nums: list[int]) -> int:
    vals = [1] + nums + [1]
    n = len(vals)
    # best[i][j] = most coins from bursting every balloon strictly between i and j.
    best = [[0] * n for _ in range(n)]
    for width in range(2, n):
        for i in range(n - width):
            j = i + width
            # k is the balloon burst last in the range. Its neighbours are then i and j.
            best[i][j] = max(
                best[i][k] + vals[i] * vals[k] * vals[j] + best[k][j]
                for k in range(i + 1, j)
            )
    return best[0][n - 1]
