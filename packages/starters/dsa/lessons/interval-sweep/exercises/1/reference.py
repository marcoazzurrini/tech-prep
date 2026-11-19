import heapq


def cars_turned_away(visits: list[list[int]], spaces: int) -> int:
    leaves: list[int] = []  # min-heap of leave times of the parked cars
    turned_away = 0
    for arrive, leave in sorted(visits):
        # Free the spaces of cars that have left.
        while leaves and leaves[0] <= arrive:
            heapq.heappop(leaves)
        if len(leaves) < spaces:
            heapq.heappush(leaves, leave)
        else:
            turned_away += 1
    return turned_away
