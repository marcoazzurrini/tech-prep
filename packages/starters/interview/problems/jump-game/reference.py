def can_jump(nums: list[int]) -> bool:
    reach = 0  # furthest index reachable so far
    for i, step in enumerate(nums):
        if i > reach:
            return False
        reach = max(reach, i + step)
    return True
