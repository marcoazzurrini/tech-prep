import heapq
from collections import Counter, deque


def least_interval(tasks: list[str], n: int) -> int:
    # Max-heap of how many runs each kind of task still needs (negative for heapq).
    heap = [-count for count in Counter(tasks).values()]
    heapq.heapify(heap)
    cooling: deque[tuple[int, int]] = deque()  # (runs left, time it may run again)
    time = 0
    while heap or cooling:
        time += 1
        if heap:
            # Run the kind with the most runs left. Then it must cool down.
            left = heapq.heappop(heap) + 1
            if left < 0:
                cooling.append((left, time + n))
        # A kind whose wait is over goes back into the heap.
        if cooling and cooling[0][1] == time:
            heapq.heappush(heap, cooling.popleft()[0])
    return time
