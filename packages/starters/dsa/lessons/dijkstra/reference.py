import heapq


def shortest_walk(n: int, paths: list[list[int]], start: int, goal: int) -> int:
    graph = [[] for _ in range(n)]
    for a, b, minutes in paths:
        graph[a].append((b, minutes))
        graph[b].append((a, minutes))

    done = set()
    heap = [(0, start)]  # (minutes from start, room)
    while heap:
        # The closest room that is not final yet.
        minutes, room = heapq.heappop(heap)
        if room == goal:
            return minutes
        if room in done:
            continue
        done.add(room)
        for nxt, w in graph[room]:
            if nxt not in done:
                heapq.heappush(heap, (minutes + w, nxt))
    return -1
