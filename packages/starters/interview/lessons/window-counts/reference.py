def longest_with_letter_limit(s: str, limit: int) -> int:
    count: dict[str, int] = {}  # letter counts of the window
    left = 0
    best = 0
    for right, c in enumerate(s):
        count[c] = count.get(c, 0) + 1
        # Only the letter that just entered can be over the limit.
        while count[c] > limit:
            count[s[left]] -= 1
            left += 1
        best = max(best, right - left + 1)
    return best
