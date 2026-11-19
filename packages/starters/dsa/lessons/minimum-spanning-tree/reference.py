import heapq


def cheapest_pipe_network(n: int, pipes: list[list[int]]) -> int:
    graph = [[] for _ in range(n)]
    for a, b, cost in pipes:
        graph[a].append((cost, b))
        graph[b].append((cost, a))

    in_tree = set()
    heap = [(0, 0)]  # (pipe cost, house): house 0 starts the tree for free
    total = 0
    while len(in_tree) < n:
        # The cheapest pipe that leaves the tree.
        cost, house = heapq.heappop(heap)
        if house in in_tree:
            continue
        in_tree.add(house)
        total += cost
        for edge in graph[house]:
            heapq.heappush(heap, edge)
    return total
