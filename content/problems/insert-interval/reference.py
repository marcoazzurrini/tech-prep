def insert(intervals: list[list[int]], new_interval: list[int]) -> list[list[int]]:
    start, end = new_interval
    result = []
    i, n = 0, len(intervals)
    # Intervals that end before the new one starts.
    while i < n and intervals[i][1] < start:
        result.append(intervals[i])
        i += 1
    # Intervals that overlap the new one get folded into it.
    while i < n and intervals[i][0] <= end:
        start = min(start, intervals[i][0])
        end = max(end, intervals[i][1])
        i += 1
    result.append([start, end])
    result.extend(intervals[i:])
    return result
