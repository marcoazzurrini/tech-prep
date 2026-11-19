def find_judge(n: int, trust: list[list[int]]) -> int:
    # Count the edges that leave each person and the edges that arrive.
    trusts = [0] * (n + 1)
    trusted_by = [0] * (n + 1)
    for a, b in trust:
        trusts[a] += 1
        trusted_by[b] += 1
    # The judge trusts nobody and is trusted by the other n - 1 people.
    for person in range(1, n + 1):
        if trusts[person] == 0 and trusted_by[person] == n - 1:
            return person
    return -1
