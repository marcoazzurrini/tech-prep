import heapq


def min_cost_connect_points(points: list[list[int]]) -> int:
    in_tree = set()
    heap = [(0, 0)]  # (cost to join, point index): start at point 0 for free
    total = 0
    while len(in_tree) < len(points):
        # The cheapest edge that leaves the tree.
        cost, i = heapq.heappop(heap)
        if i in in_tree:
            continue
        in_tree.add(i)
        total += cost
        # Offer an edge from the new point to every point outside the tree.
        for j, (x, y) in enumerate(points):
            if j not in in_tree:
                dist = abs(points[i][0] - x) + abs(points[i][1] - y)
                heapq.heappush(heap, (dist, j))
    return total
