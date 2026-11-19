import heapq


def k_closest(points: list[list[int]], k: int) -> list[list[int]]:
    # Max-heap of the k closest points so far (negative distance, since heapq is a min-heap).
    heap: list[tuple[int, int, int]] = []
    for x, y in points:
        heapq.heappush(heap, (-(x * x + y * y), x, y))
        # More than k points: drop the farthest one.
        if len(heap) > k:
            heapq.heappop(heap)
    return [[x, y] for _, x, y in heap]
