def cheapest_frog_path(heights: list[int]) -> int:
    # cost[i] = lowest cost to reach stone i.
    cost = [0] * len(heights)
    for i in range(1, len(heights)):
        cost[i] = cost[i - 1] + abs(heights[i] - heights[i - 1])
        if i >= 2:
            # The last jump may also come from two stones back.
            cost[i] = min(cost[i], cost[i - 2] + abs(heights[i] - heights[i - 2]))
    return cost[-1]
