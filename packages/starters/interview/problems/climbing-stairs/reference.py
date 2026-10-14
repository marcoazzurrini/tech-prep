def climb_stairs(n: int) -> int:
    # ways(i) = ways(i - 1) + ways(i - 2); keep only the last two values.
    prev, cur = 1, 1
    for _ in range(n - 1):
        prev, cur = cur, prev + cur
    return cur
