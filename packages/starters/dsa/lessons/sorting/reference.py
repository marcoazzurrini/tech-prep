def is_consecutive_run(nums: list[int]) -> bool:
    # In sorted order, a run rises by exactly 1 at every step.
    ordered = sorted(nums)
    for i in range(1, len(ordered)):
        if ordered[i] - ordered[i - 1] != 1:
            return False
    return True
