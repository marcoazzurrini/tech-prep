import heapq


def min_meeting_rooms(intervals: list[list[int]]) -> int:
    ends: list[int] = []  # min-heap of end times of meetings in progress
    for start, end in sorted(intervals):
        if ends and ends[0] <= start:
            heapq.heapreplace(ends, end)
        else:
            heapq.heappush(ends, end)
    return len(ends)
