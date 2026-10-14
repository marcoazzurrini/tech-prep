def rob(nums: list[int]) -> int:
    # skip = best total so far without taking the previous house; take = best overall so far.
    skip, take = 0, 0
    for x in nums:
        skip, take = take, max(take, skip + x)
    return take
