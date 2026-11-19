def wrap_index(ids: list[int]) -> int:
    lo, hi = 0, len(ids) - 1
    while lo < hi:
        mid = (lo + hi + 1) // 2  # round up, so mid is never lo
        if ids[mid] > ids[lo]:
            # lo..mid is sorted: the largest ID is at mid or to its right.
            lo = mid
        else:
            # The drop is between lo and mid: the largest ID is left of mid.
            hi = mid - 1
    return lo
