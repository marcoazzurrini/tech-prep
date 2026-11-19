def min_merge_cost(piles: list[int]) -> int:
    n = len(piles)
    # cost[i][j] = cheapest way to merge piles i..j into one pile.
    cost = [[0] * n for _ in range(n)]
    for width in range(1, n):
        for i in range(n - width):
            j = i + width
            # The last merge joins the piles i..k and k+1..j. Try every k.
            best = min(cost[i][k] + cost[k + 1][j] for k in range(i, j))
            # The last merge costs all the stones of the range.
            cost[i][j] = best + sum(piles[i:j + 1])
    return cost[0][n - 1]
