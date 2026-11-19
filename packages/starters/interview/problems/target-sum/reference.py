def find_target_sum_ways(nums: list[int], target: int) -> int:
    # If the plus group sums to p, then p - (total - p) = target, so p = (total + target) / 2.
    total = sum(nums)
    if abs(target) > total or (total + target) % 2 == 1:
        return 0
    goal = (total + target) // 2
    # ways[s] = number of subsets that sum to s.
    ways = [1] + [0] * goal
    for num in nums:
        # Going downwards uses each number at most once.
        for s in range(goal, num - 1, -1):
            ways[s] += ways[s - num]
    return ways[goal]
