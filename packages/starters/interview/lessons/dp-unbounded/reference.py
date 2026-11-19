def best_ribbon_price(prices: list[int], length: int) -> int:
    # best[n] = most money for a ribbon of length n.
    best = [0] * (length + 1)
    for n in range(1, length + 1):
        # Try every size for the last piece. The rest may reuse any size.
        for piece in range(1, min(n, len(prices)) + 1):
            best[n] = max(best[n], prices[piece - 1] + best[n - piece])
    return best[length]
