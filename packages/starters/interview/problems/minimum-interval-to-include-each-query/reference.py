import heapq


def min_interval(intervals: list[list[int]], queries: list[int]) -> list[int]:
    intervals = sorted(intervals)
    answer = [-1] * len(queries)
    heap: list[tuple[int, int]] = []  # (size, right) of intervals that have started
    i = 0
    # Answer the queries from smallest to largest.
    for q, index in sorted((q, index) for index, q in enumerate(queries)):
        # Add every interval that starts at or before q.
        while i < len(intervals) and intervals[i][0] <= q:
            left, right = intervals[i]
            heapq.heappush(heap, (right - left + 1, right))
            i += 1
        # Drop intervals that ended before q. They cannot hold a later query either.
        while heap and heap[0][1] < q:
            heapq.heappop(heap)
        if heap:
            answer[index] = heap[0][0]
    return answer
