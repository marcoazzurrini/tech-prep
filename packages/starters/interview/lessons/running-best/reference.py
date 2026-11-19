def count_record_lows(prices: list[int]) -> int:
    lowest = float("inf")  # lowest price on the earlier days
    count = 0
    for price in prices:
        if price < lowest:
            count += 1
            lowest = price
    return count
