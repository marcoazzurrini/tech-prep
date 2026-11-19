def find_cheapest_price(n: int, flights: list[list[int]], src: int, dst: int, k: int) -> int:
    INF = float("inf")
    price = [INF] * n  # cheapest price to each city so far
    price[src] = 0
    # k stops allow k + 1 flights. Each round adds one flight.
    for _ in range(k + 1):
        # Read from the last round, so a round never chains two flights.
        prev = price[:]
        for a, b, cost in flights:
            if prev[a] + cost < price[b]:
                price[b] = prev[a] + cost
    return -1 if price[dst] == INF else price[dst]
