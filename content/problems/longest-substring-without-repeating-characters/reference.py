def length_of_longest_substring(s: str) -> int:
    last_seen = {}  # char -> last index where it appeared
    start = 0
    best = 0
    for i, c in enumerate(s):
        if last_seen.get(c, -1) >= start:
            start = last_seen[c] + 1  # jump past the previous copy
        last_seen[c] = i
        best = max(best, i - start + 1)
    return best
