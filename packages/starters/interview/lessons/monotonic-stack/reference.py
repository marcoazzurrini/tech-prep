def nearest_taller_on_left(heights: list[int]) -> list[int]:
    answer = []
    stack = []  # indexes of people, tallest at the bottom
    for i, h in enumerate(heights):
        # Nobody to the right will ever pick a person who is not taller than h.
        while stack and heights[stack[-1]] <= h:
            stack.pop()
        # Whoever is left on top is the nearest taller person.
        answer.append(stack[-1] if stack else -1)
        stack.append(i)
    return answer
