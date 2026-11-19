def array_pair_sum(nums: list[int]) -> int:
    # After sorting, pair each value with its neighbour.
    # The larger value of a pair is lost, so lose as little as possible.
    ordered = sorted(nums)
    # The smaller value of each pair sits at an even index.
    return sum(ordered[0::2])
