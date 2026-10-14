def spiral_order(matrix: list[list[int]]) -> list[int]:
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        result.extend(matrix[top][c] for c in range(left, right + 1))
        result.extend(matrix[r][right] for r in range(top + 1, bottom + 1))
        # Only walk back along the bottom/left when they are distinct from top/right.
        if top < bottom and left < right:
            result.extend(matrix[bottom][c] for c in range(right - 1, left - 1, -1))
            result.extend(matrix[r][left] for r in range(bottom - 1, top, -1))
        top, bottom, left, right = top + 1, bottom - 1, left + 1, right - 1
    return result
