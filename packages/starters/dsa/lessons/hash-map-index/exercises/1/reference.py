def previous_equal_index(nums: list[int]) -> list[int]:
    last_index: dict[int, int] = {}  # value -> index where it was last seen
    prev = []
    for i, n in enumerate(nums):
        prev.append(last_index.get(n, -1))
        # Store after the lookup, so an element never finds itself.
        last_index[n] = i
    return prev
