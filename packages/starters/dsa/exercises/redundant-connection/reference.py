def find_redundant_connection(edges: list[list[int]]) -> list[int]:
    parent = list(range(len(edges) + 1))

    def find(x: int) -> int:
        while parent[x] != x:
            parent[x] = parent[parent[x]]  # path halving keeps the paths short
            x = parent[x]
        return x

    for a, b in edges:
        root_a, root_b = find(a), find(b)
        # Both ends are already in one group: this edge closes the cycle.
        if root_a == root_b:
            return [a, b]
        parent[root_a] = root_b
    return []
