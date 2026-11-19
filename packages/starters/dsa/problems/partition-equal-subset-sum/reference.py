def can_partition(nums: list[int]) -> bool:
    total = sum(nums)
    if total % 2 == 1:
        return False
    half = total // 2
    # can[t] is True when some of the numbers add up to exactly t.
    can = [True] + [False] * half
    for num in nums:
        # Go from high to low, so each number is used at most once.
        for t in range(half, num - 1, -1):
            if can[t - num]:
                can[t] = True
    return can[half]
