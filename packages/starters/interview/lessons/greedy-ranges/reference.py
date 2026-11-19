def room_count_range(log: str) -> list[int]:
    low = 0  # fewest people possible so far
    high = 0  # most people possible so far
    for event in log:
        if event == "E":
            low += 1
            high += 1
        elif event == "L":
            low -= 1
            high -= 1
        else:  # "?": nobody or one person entered
            high += 1
        # Even the fullest room had nobody to leave.
        if high < 0:
            return []
        # An empty room is ruled out by "L"; the count is never negative.
        low = max(low, 0)
    return [low, high]
