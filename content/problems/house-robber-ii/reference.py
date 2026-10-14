def rob(nums: list[int]) -> int:
    def rob_line(houses: list[int]) -> int:
        skip, take = 0, 0
        for x in houses:
            skip, take = take, max(take, skip + x)
        return take

    if len(nums) == 1:
        return nums[0]
    # The first and last house can't both be taken: drop one of them.
    return max(rob_line(nums[1:]), rob_line(nums[:-1]))
