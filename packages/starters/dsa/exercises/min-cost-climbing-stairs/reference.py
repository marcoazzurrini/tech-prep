def min_cost_climbing_stairs(cost: list[int]) -> int:
    # prev = cheapest way to stand on the stair one below, before = two below.
    before, prev = 0, 0
    for i in range(2, len(cost) + 1):
        # Arrive from one stair below or from two stairs below, and pay for that stair.
        before, prev = prev, min(prev + cost[i - 1], before + cost[i - 2])
    return prev
