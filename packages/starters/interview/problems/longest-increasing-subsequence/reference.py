from bisect import bisect_left


def length_of_lis(nums: list[int]) -> int:
    # tails[k] = smallest possible last value of an increasing subsequence of length k + 1.
    tails: list[int] = []
    for x in nums:
        i = bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)
