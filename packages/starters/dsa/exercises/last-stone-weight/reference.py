import heapq


def last_stone_weight(stones: list[int]) -> int:
    # heapq is a min-heap. Store negative weights to get the heaviest first.
    heap = [-s for s in stones]
    heapq.heapify(heap)
    while len(heap) > 1:
        first = -heapq.heappop(heap)
        second = -heapq.heappop(heap)
        # What is left of the heavier stone goes back into the heap.
        if first > second:
            heapq.heappush(heap, -(first - second))
    return -heap[0] if heap else 0
