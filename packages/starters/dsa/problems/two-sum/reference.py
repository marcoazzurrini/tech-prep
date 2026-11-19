def two_sum(nums: list[int], target: int) -> list[int]:
    index_of = {}  # value -> index of an earlier element
    for i, n in enumerate(nums):
        if target - n in index_of:
            return [index_of[target - n], i]
        index_of[n] = i
    return []
