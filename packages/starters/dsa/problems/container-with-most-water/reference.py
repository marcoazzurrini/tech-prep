def max_area(height: list[int]) -> int:
    i, j = 0, len(height) - 1
    best = 0
    while i < j:
        best = max(best, (j - i) * min(height[i], height[j]))
        # The shorter wall limits the area, so move it inward.
        if height[i] < height[j]:
            i += 1
        else:
            j -= 1
    return best
