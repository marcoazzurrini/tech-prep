def missing_number(nums: list[int]) -> int:
    # XOR every index and value with n: matching pairs cancel, leaving the gap.
    result = len(nums)
    for i, x in enumerate(nums):
        result ^= i ^ x
    return result
