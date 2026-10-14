def can_attend_meetings(intervals: list[list[int]]) -> bool:
    intervals = sorted(intervals)
    for (_, prev_end), (start, _) in zip(intervals, intervals[1:]):
        if start < prev_end:
            return False
    return True
