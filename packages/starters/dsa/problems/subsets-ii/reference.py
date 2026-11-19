def subsets_with_dup(nums: list[int]) -> list[list[int]]:
    nums = sorted(nums)  # equal values become neighbours
    result = []
    subset = []

    def backtrack(start: int) -> None:
        result.append(subset[:])
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]:
                continue  # this value already started a branch at this depth
            subset.append(nums[i])
            backtrack(i + 1)
            subset.pop()

    backtrack(0)
    return result
