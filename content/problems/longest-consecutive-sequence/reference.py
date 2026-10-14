def longest_consecutive(nums: list[int]) -> int:
    values = set(nums)
    best = 0
    for n in values:
        if n - 1 in values:
            continue  # only count from the start of a run
        length = 1
        while n + length in values:
            length += 1
        best = max(best, length)
    return best
