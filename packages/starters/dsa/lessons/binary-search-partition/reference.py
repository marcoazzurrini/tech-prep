def count_from_first(a: list[int], b: list[int], k: int) -> int:
    # i values come from a, so k - i come from b. Both counts must fit.
    lo, hi = max(0, k - len(b)), min(k, len(a))
    while lo < hi:
        i = (lo + hi) // 2
        j = k - i  # the cut in b follows
        if b[j - 1] > a[i]:
            lo = i + 1  # a[i] belongs on the left: take more from a
        else:
            hi = i  # a[i] belongs on the right: do not take more
    return lo
