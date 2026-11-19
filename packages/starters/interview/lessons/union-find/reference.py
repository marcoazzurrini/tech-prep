def same_group_queries(n: int, links: list[list[int]], queries: list[list[int]]) -> list[bool]:
    parent = list(range(n))

    def find(x: int) -> int:
        while parent[x] != x:
            parent[x] = parent[parent[x]]  # path halving keeps the paths short
            x = parent[x]
        return x

    # Union: point the root of one group at the root of the other.
    for a, b in links:
        parent[find(a)] = find(b)
    # Same root means same group.
    return [find(x) == find(y) for x, y in queries]
