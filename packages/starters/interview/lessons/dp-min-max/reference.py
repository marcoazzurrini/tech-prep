def best_add_or_multiply(nums: list[int]) -> int:
    high = low = nums[0]
    for x in nums[1:]:
        # A negative x can turn the smallest value into the largest, so try both.
        options = [high + x, high * x, low + x, low * x]
        high, low = max(options), min(options)
    return high
