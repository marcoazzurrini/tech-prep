def cheapest_with_tickets(n: int, rides: list[list[int]], tickets: int) -> list[int]:
    INF = float("inf")
    price = [INF] * n
    price[0] = 0
    # Each round adds one ride.
    for _ in range(tickets):
        # Read from the last round, so a round never chains two rides.
        prev = price[:]
        for a, b, cost in rides:
            price[b] = min(price[b], prev[a] + cost)
    return [-1 if p == INF else p for p in price]
