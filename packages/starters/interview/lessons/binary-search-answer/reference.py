def min_print_time(seconds: list[int], pages: int) -> int:
    def enough(t: int) -> bool:
        return sum(t // s for s in seconds) >= pages

    # The fastest printer alone finishes the job in min(seconds) * pages seconds.
    lo, hi = 1, min(seconds) * pages
    while lo < hi:
        mid = (lo + hi) // 2
        if enough(mid):
            hi = mid  # enough time: keep it and try less
        else:
            lo = mid + 1  # not enough: the answer is larger
    return lo
