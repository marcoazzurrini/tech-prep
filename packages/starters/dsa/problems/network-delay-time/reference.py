import heapq
from collections import defaultdict


def network_delay_time(times: list[list[int]], n: int, k: int) -> int:
    graph = defaultdict(list)
    for src, dst, time in times:
        graph[src].append((dst, time))

    dist = {}  # node -> final arrival time
    heap = [(0, k)]  # (arrival time, node)
    while heap:
        # The closest node that is not final yet.
        time, node = heapq.heappop(heap)
        if node in dist:
            continue
        dist[node] = time
        for nxt, w in graph[node]:
            if nxt not in dist:
                heapq.heappush(heap, (time + w, nxt))

    # The last node to receive the signal sets the answer.
    return max(dist.values()) if len(dist) == n else -1
