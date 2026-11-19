def max_sub_array(nums: list[int]) -> int:
    # cur = best sum of a subarray ending here; restart when the running sum would only hurt.
    best = cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best
