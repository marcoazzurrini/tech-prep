def subsets(nums: list[int]) -> list[list[int]]:
    result = []
    subset = []

    def backtrack(start: int) -> None:
        result.append(subset[:])  # every partial choice is a subset
        for i in range(start, len(nums)):
            subset.append(nums[i])  # choose
            backtrack(i + 1)  # only later numbers, so no subset repeats
            subset.pop()  # undo

    backtrack(0)
    return result
