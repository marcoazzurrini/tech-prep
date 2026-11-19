def count_reachable_totals(nums: list[int]) -> int:
    total = sum(nums)
    # can[t] is True when some of the numbers add up to exactly t.
    can = [True] + [False] * total
    for num in nums:
        # Go from high to low, so each number is used at most once.
        for t in range(total, num - 1, -1):
            if can[t - num]:
                can[t] = True
    return sum(can)
