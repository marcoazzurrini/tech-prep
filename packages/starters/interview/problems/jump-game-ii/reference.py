def jump(nums: list[int]) -> int:
    jumps = 0
    end = 0  # farthest index the jumps so far can reach
    farthest = 0  # farthest index one more jump can reach
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        # Past `end` you need one more jump. Take it as far as possible.
        if i == end:
            jumps += 1
            end = farthest
    return jumps
