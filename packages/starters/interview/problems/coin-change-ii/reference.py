def change(amount: int, coins: list[int]) -> int:
    # ways[a] = number of combinations that add up to a, using the coins seen so far.
    ways = [1] + [0] * amount
    # Coins in the outer loop: each combination is counted once, not once per order.
    for coin in coins:
        # Going upwards lets the same coin be used again.
        for a in range(coin, amount + 1):
            ways[a] += ways[a - coin]
    return ways[amount]
