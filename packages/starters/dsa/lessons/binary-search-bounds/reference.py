def count_in_range(nums: list[int], low: int, high: int) -> int:
    def first_at_least(x: int) -> int:
        # Index of the first value >= x, or len(nums) if there is none.
        lo, hi = 0, len(nums)
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] >= x:
                hi = mid
            else:
                lo = mid + 1
        return lo

    # Values below high + 1, minus values below low.
    return first_at_least(high + 1) - first_at_least(low)
