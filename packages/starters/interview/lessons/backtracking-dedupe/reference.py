def distinct_picks(nums: list[int], size: int) -> list[list[int]]:
    nums = sorted(nums)  # equal values become neighbours
    result = []
    pick = []

    def backtrack(start: int) -> None:
        if len(pick) == size:
            result.append(pick[:])
            return
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]:
                continue  # same value at the same depth
            pick.append(nums[i])
            backtrack(i + 1)
            pick.pop()

    backtrack(0)
    return result
