def binary_search(nums: list[int], target: int) -> int:
    # The target, if present, is always inside lo..hi (both included).
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1  # mid is too small: drop it and the left part
        else:
            hi = mid - 1  # mid is too large: drop it and the right part
    return -1
