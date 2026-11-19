def two_sum_sorted(numbers: list[int], target: int) -> list[int]:
    left, right = 0, len(numbers) - 1
    while left < right:
        total = numbers[left] + numbers[right]
        if total == target:
            return [left + 1, right + 1]  # positions count from 1
        if total < target:
            left += 1  # only a larger left value can raise the sum
        else:
            right -= 1  # only a smaller right value can lower the sum
    return []
