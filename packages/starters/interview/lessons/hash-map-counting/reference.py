def count_exactly_twice(nums: list[int]) -> int:
    # Count how often each value appears.
    counts: dict[int, int] = {}
    for n in nums:
        counts[n] = counts.get(n, 0) + 1
    # Then look at each different value once.
    return sum(1 for count in counts.values() if count == 2)
