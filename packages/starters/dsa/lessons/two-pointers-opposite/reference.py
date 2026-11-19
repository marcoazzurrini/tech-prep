def heaviest_pair_under_limit(weights: list[int], limit: int) -> int:
    left, right = 0, len(weights) - 1
    best = -1
    while left < right:
        total = weights[left] + weights[right]
        if total <= limit:
            best = max(best, total)
            left += 1  # this is the best partner for left; try a heavier left
        else:
            right -= 1  # right is too heavy for every item that remains
    return best
