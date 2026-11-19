def is_match(s: str, p: str) -> bool:
    m, n = len(s), len(p)
    # ok[i][j] = the first i chars of s match the first j chars of p.
    ok = [[False] * (n + 1) for _ in range(m + 1)]
    ok[0][0] = True
    for i in range(m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == "*":
                # Use the starred char zero times, or let it match one more char of s.
                zero = ok[i][j - 2]
                more = i > 0 and p[j - 2] in (s[i - 1], ".") and ok[i - 1][j]
                ok[i][j] = zero or more
            else:
                # A plain char or a dot must match the last char of the prefix of s.
                ok[i][j] = i > 0 and p[j - 1] in (s[i - 1], ".") and ok[i - 1][j - 1]
    return ok[m][n]
