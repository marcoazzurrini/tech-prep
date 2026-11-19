import heapq


class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.heap: list[int] = []  # min-heap holding the k largest numbers
        for num in nums:
            self.add(num)

    def add(self, val: int) -> int:
        heapq.heappush(self.heap, val)
        # More than k numbers: the smallest can never be the answer again.
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        # The smallest of the k largest is the kth largest.
        return self.heap[0]
