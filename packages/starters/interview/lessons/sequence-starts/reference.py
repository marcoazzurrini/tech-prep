def longest_doubling_chain(nums: list[int]) -> int:
    values = set(nums)
    best = 0
    for n in values:
        # n starts a chain only when its half is missing.
        if n % 2 == 0 and n // 2 in values:
            continue
        length = 1
        while n * 2 in values:
            n *= 2
            length += 1
        best = max(best, length)
    return best
