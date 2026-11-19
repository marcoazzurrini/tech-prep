def first_repeated_value(nums: list[int]) -> int:
    for num in nums:
        value = abs(num)  # the cell may already carry a flag
        # A negative number at index value - 1 means: value was seen before.
        if nums[value - 1] < 0:
            return value
        nums[value - 1] = -nums[value - 1]
    return -1
