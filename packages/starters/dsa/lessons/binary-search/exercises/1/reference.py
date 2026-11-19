def search_descending(scores: list[int], target: int) -> int:
    lo, hi = 0, len(scores) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if scores[mid] == target:
            return mid
        # Largest first: a score that is too large means the target is to the right.
        if scores[mid] > target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
