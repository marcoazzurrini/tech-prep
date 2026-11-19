def can_split_into_short_palindromes(s: str) -> bool:
    n = len(s)
    # ok[i] is True when the first i letters split into good pieces.
    ok = [True] + [False] * n
    for i in range(2, n + 1):
        # The last piece has length 2 or 3. The letters before it must split too.
        if s[i - 2] == s[i - 1] and ok[i - 2]:
            ok[i] = True
        if i >= 3 and s[i - 3] == s[i - 1] and ok[i - 3]:
            ok[i] = True
    return ok[n]
