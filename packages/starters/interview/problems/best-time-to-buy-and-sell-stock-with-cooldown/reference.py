def max_profit_with_cooldown(prices: list[int]) -> int:
    # Three states at the end of each day: holding a share, just sold, resting.
    hold, sold, rest = float("-inf"), 0, 0
    for price in prices:
        # Buy only from rest. That enforces the one-day wait after a sale.
        hold, sold, rest = max(hold, rest - price), hold + price, max(rest, sold)
    return max(sold, rest)
