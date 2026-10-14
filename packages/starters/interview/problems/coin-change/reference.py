def coin_change(coins: list[int], amount: int) -> int:
    # best[a] = fewest coins summing to a (amount + 1 means "impossible").
    best = [0] + [amount + 1] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and best[a - c] + 1 < best[a]:
                best[a] = best[a - c] + 1
    return best[amount] if best[amount] <= amount else -1
