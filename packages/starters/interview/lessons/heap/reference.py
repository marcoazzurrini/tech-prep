import heapq


def smallest_after_doubling(piles: list[int], k: int) -> int:
    # A min-heap keeps the smallest pile on top.
    heap = list(piles)
    heapq.heapify(heap)
    for _ in range(k):
        # Take the smallest pile out, double it, and put it back.
        heapq.heappush(heap, 2 * heapq.heappop(heap))
    return heap[0]
