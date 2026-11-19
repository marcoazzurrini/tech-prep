def single_number(nums: list[int]) -> int:
    result = 0
    for num in nums:
        # x ^ x = 0, so each pair cancels. x ^ 0 = x, so the lone value stays.
        result ^= num
    return result
