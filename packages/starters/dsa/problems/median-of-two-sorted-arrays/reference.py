def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:
    a, b = nums1, nums2
    if len(a) > len(b):
        a, b = b, a  # search the cut in the shorter array
    half = (len(a) + len(b) + 1) // 2  # size of the left part
    inf = float("inf")

    lo, hi = 0, len(a)
    while True:
        i = (lo + hi) // 2  # values taken from a
        j = half - i  # the cut in b follows
        a_left = a[i - 1] if i > 0 else -inf
        a_right = a[i] if i < len(a) else inf
        b_left = b[j - 1] if j > 0 else -inf
        b_right = b[j] if j < len(b) else inf

        if a_left > b_right:
            hi = i - 1  # took too many from a
        elif b_left > a_right:
            lo = i + 1  # took too few from a
        else:
            # Everything on the left is at most everything on the right.
            if (len(a) + len(b)) % 2 == 1:
                return float(max(a_left, b_left))
            return (max(a_left, b_left) + min(a_right, b_right)) / 2
