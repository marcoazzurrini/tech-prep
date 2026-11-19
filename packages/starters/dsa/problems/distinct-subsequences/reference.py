def num_distinct(s: str, t: str) -> int:
    # ways[j] = number of ways to build the first j chars of t from the part of s read so far.
    ways = [1] + [0] * len(t)
    for ch in s:
        # Go backwards so that ways[j - 1] still belongs to the shorter prefix of s.
        for j in range(len(t), 0, -1):
            if t[j - 1] == ch:
                # Skip ch (keep ways[j]) or match it with t[j - 1] (add ways[j - 1]).
                ways[j] += ways[j - 1]
    return ways[len(t)]
