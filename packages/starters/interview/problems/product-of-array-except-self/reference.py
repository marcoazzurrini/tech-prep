def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    answer = [1] * n
    # First pass: answer[i] = product of everything left of i.
    for i in range(1, n):
        answer[i] = answer[i - 1] * nums[i - 1]
    # Second pass: multiply in the product of everything right of i.
    right = 1
    for i in range(n - 1, -1, -1):
        answer[i] *= right
        right *= nums[i]
    return answer
