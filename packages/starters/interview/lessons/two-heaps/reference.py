import heapq


def middle_gap(nums: list[int]) -> int:
    low: list[int] = []  # max-heap (negative values): the lower half
    high: list[int] = []  # min-heap: the upper half
    for num in nums:
        # Go through `low`, so the largest low number moves up to `high`.
        heapq.heappush(low, -num)
        heapq.heappush(high, -heapq.heappop(low))
        # Keep the sizes balanced.
        if len(high) > len(low):
            heapq.heappush(low, -heapq.heappop(high))
    return high[0] - -low[0]
