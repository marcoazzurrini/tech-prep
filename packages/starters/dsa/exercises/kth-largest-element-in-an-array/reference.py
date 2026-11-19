import heapq


def find_kth_largest(nums: list[int], k: int) -> int:
    # Min-heap holding the k largest values seen so far.
    heap: list[int] = []
    for num in nums:
        heapq.heappush(heap, num)
        # More than k values: the smallest cannot be the answer.
        if len(heap) > k:
            heapq.heappop(heap)
    # The smallest of the k largest is the kth largest.
    return heap[0]
