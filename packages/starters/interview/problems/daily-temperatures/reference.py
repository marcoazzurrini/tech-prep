def daily_temperatures(temperatures: list[int]) -> list[int]:
    answer = [0] * len(temperatures)
    stack = []  # days that still wait for a warmer day, warmest at the bottom
    for day, temp in enumerate(temperatures):
        # Today is warmer than the day on top: that day has its answer.
        while stack and temp > temperatures[stack[-1]]:
            earlier = stack.pop()
            answer[earlier] = day - earlier
        stack.append(day)
    return answer
