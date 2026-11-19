def best_pair_products(nums: list[int]) -> int:
    # best[i] = largest total from the first i numbers.
    best = [0] * (len(nums) + 1)
    for i in range(2, len(nums) + 1):
        skip = best[i - 1]
        # Taking the pair uses two numbers, so build on best[i - 2].
        take = best[i - 2] + nums[i - 2] * nums[i - 1]
        best[i] = max(skip, take)
    return best[-1]
