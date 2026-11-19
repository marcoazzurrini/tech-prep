def distance_to_nearest_hub(n: int, roads: list[list[int]], hubs: list[int]) -> list[int]:
    graph: list[list[int]] = [[] for _ in range(n)]
    for a, b in roads:
        graph[a].append(b)
        graph[b].append(a)

    # Every hub starts in the queue with distance 0.
    dist = [-1] * n
    for hub in hubs:
        dist[hub] = 0
    queue = list(hubs)
    for town in queue:  # the loop also reads towns appended below
        for neighbour in graph[town]:
            # -1 means not reached yet. The first visit comes from the nearest hub.
            if dist[neighbour] == -1:
                dist[neighbour] = dist[town] + 1
                queue.append(neighbour)
    return dist
