def erase_overlap_intervals(intervals: list[list[int]]) -> int:
    # Greedy: keep the interval that ends earliest, drop anything that clashes with it.
    removed = 0
    prev_end = float("-inf")
    for start, end in sorted(intervals, key=lambda iv: iv[1]):
        if start >= prev_end:
            prev_end = end
        else:
            removed += 1
    return removed
