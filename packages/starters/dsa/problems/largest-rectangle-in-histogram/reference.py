def largest_rectangle_area(heights: list[int]) -> int:
    best = 0
    stack = []  # (start index, height), heights increase toward the top
    for i, h in enumerate(heights + [0]):  # the last 0 pops every bar left
        start = i
        # A lower bar ends every taller rectangle on the stack.
        while stack and stack[-1][1] > h:
            start, height = stack.pop()
            best = max(best, height * (i - start))
        # The new bar reaches back to where the popped bars began.
        stack.append((start, h))
    return best
