def group_sizes(n: int, edges: list[list[int]]) -> list[int]:
    graph: list[list[int]] = [[] for _ in range(n)]
    for a, b in edges:
        graph[a].append(b)
        graph[b].append(a)

    visited = [False] * n
    sizes = []
    # Every unvisited node starts a new group.
    for start in range(n):
        if visited[start]:
            continue
        visited[start] = True
        stack = [start]
        size = 0
        while stack:
            node = stack.pop()
            size += 1
            for neighbour in graph[node]:
                if not visited[neighbour]:
                    visited[neighbour] = True  # mark when pushed
                    stack.append(neighbour)
        sizes.append(size)
    return sorted(sizes)
