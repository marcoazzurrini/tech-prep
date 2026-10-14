from collections import defaultdict


def character_replacement(s: str, k: int) -> int:
    counts = defaultdict(int)
    left = 0
    max_freq = 0
    best = 0
    for right, c in enumerate(s):
        counts[c] += 1
        max_freq = max(max_freq, counts[c])
        # Window is valid while the chars that must change fit in k.
        if right - left + 1 - max_freq > k:
            counts[s[left]] -= 1
            left += 1
        best = max(best, right - left + 1)
    return best
