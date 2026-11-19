def longest_free_gap(intervals: list[list[int]]) -> int:
    intervals = sorted(intervals)  # by start
    longest = 0
    block_end = intervals[0][1]  # end of the current merged block
    for start, end in intervals:
        if start > block_end:
            longest = max(longest, start - block_end)  # no overlap: a gap
        block_end = max(block_end, end)  # keep the furthest end
    return longest
