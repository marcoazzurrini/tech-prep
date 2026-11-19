def max_product(nums: list[int]) -> int:
    # Track both the largest and smallest product ending here: a negative number swaps them.
    best = hi = lo = nums[0]
    for x in nums[1:]:
        hi, lo = max(x, hi * x, lo * x), min(x, hi * x, lo * x)
        best = max(best, hi)
    return best
