def rank_by_wins(wins: list[int]) -> list[int]:
    # buckets[w] holds the players with w wins, in index order.
    buckets: list[list[int]] = [[] for _ in range(len(wins) + 1)]
    for player, w in enumerate(wins):
        buckets[w].append(player)
    # Read the buckets from the most wins down.
    ranked = []
    for w in range(len(wins), -1, -1):
        ranked.extend(buckets[w])
    return ranked
