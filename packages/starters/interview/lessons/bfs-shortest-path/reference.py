def fewest_flights(n: int, flights: list[list[int]], start: int, target: int) -> int:
    graph: list[list[int]] = [[] for _ in range(n)]
    for a, b in flights:
        graph[a].append(b)
        graph[b].append(a)

    # BFS by levels: every airport of `level` is `count` flights from the start.
    seen = {start}
    level = [start]
    count = 0
    while level:
        if target in level:
            return count
        next_level = []
        for airport in level:
            for neighbour in graph[airport]:
                if neighbour not in seen:
                    seen.add(neighbour)  # the first visit is the shortest one
                    next_level.append(neighbour)
        level = next_level
        count += 1
    return -1
