from collections import defaultdict


def walk_every_street(streets: list[list[int]], start: int) -> list[int]:
    out = defaultdict(list)  # corner -> corners its unused streets lead to
    for a, b in streets:
        out[a].append(b)

    route = []

    def walk(corner: int) -> None:
        # pop() deletes the street as it is used.
        while out[corner]:
            walk(out[corner].pop())
        # No streets left here: the corner goes on the route, back to front.
        route.append(corner)

    walk(start)
    return route[::-1]
