def permute(nums: list[int]) -> list[list[int]]:
    result = []
    perm = []
    used = [False] * len(nums)

    def backtrack() -> None:
        if len(perm) == len(nums):
            result.append(perm[:])
            return
        for i in range(len(nums)):
            if used[i]:
                continue  # already in this permutation
            used[i] = True
            perm.append(nums[i])
            backtrack()
            perm.pop()
            used[i] = False  # release it for the next branch

    backtrack()
    return result
