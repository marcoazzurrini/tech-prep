def car_fleet(target: int, position: list[int], speed: list[int]) -> int:
    # Visit the cars from the one nearest the target to the one farthest.
    cars = sorted(zip(position, speed), reverse=True)
    stack = []  # arrival time of each fleet, slowest fleet on top
    for pos, spd in cars:
        stack.append((target - pos) / spd)
        # This car arrives no later than the fleet ahead: it joins that fleet.
        if len(stack) >= 2 and stack[-1] <= stack[-2]:
            stack.pop()
    return len(stack)
