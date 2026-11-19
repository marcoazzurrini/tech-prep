from collections import Counter


def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = Counter(nums)
    # Bucket sort: buckets[f] holds the values that appear exactly f times.
    buckets = [[] for _ in range(len(nums) + 1)]
    for n, f in counts.items():
        buckets[f].append(n)
    result = []
    for f in range(len(buckets) - 1, 0, -1):
        for n in buckets[f]:
            result.append(n)
            if len(result) == k:
                return result
    return result
