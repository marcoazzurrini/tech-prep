def mutual_friends(n: int, friendships: list[list[int]], a: int, b: int) -> list[int]:
    # Adjacency list: friends[p] holds every friend of person p.
    friends: list[set[int]] = [set() for _ in range(n)]
    for x, y in friendships:
        friends[x].add(y)
        friends[y].add(x)
    # Keep the people who are in both lists.
    return sorted(friends[a] & friends[b])
