def get_concatenation(nums: list[int]) -> list[int]:
    ans = []
    # Walk nums twice. Each append adds one item at the end in O(1).
    for _ in range(2):
        for n in nums:
            ans.append(n)
    return ans
