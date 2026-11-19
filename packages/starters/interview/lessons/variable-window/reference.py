def longest_run_within_budget(costs: list[int], budget: int) -> int:
    left = 0
    total = 0  # cost of the window
    best = 0
    for right, cost in enumerate(costs):
        total += cost  # grow on the right
        while total > budget:  # shrink on the left until the window fits
            total -= costs[left]
            left += 1
        best = max(best, right - left + 1)
    return best
