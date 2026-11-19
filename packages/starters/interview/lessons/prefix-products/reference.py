def largest_elsewhere(nums: list[int]) -> list[int]:
    n = len(nums)
    answer = [0] * n
    # Left pass: answer[i] is the largest value before i.
    before = float("-inf")
    for i in range(n):
        answer[i] = before
        before = max(before, nums[i])
    # Right pass: combine it with the largest value after i.
    after = float("-inf")
    for i in range(n - 1, -1, -1):
        answer[i] = max(answer[i], after)
        after = max(after, nums[i])
    return answer
