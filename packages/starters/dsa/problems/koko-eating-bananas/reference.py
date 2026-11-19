def min_eating_speed(piles: list[int], h: int) -> int:
    def hours_needed(k: int) -> int:
        # A pile of p bananas takes ceil(p / k) hours.
        return sum((p + k - 1) // k for p in piles)

    # Search the speeds 1..max(piles). The largest one always works.
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if hours_needed(mid) <= h:
            hi = mid  # fast enough: keep it and try slower
        else:
            lo = mid + 1  # too slow: the answer is faster
    return lo
