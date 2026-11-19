def can_reach_hospital(n: int, streets: list[list[int]], hospitals: list[int]) -> list[int]:
    # Reverse every street: came_from[x] lists the crossings with a street into x.
    came_from: list[list[int]] = [[] for _ in range(n)]
    for start, end in streets:
        came_from[end].append(start)

    # Search backwards from the hospitals. Every crossing found can drive to one.
    seen = set(hospitals)
    stack = list(hospitals)
    while stack:
        for crossing in came_from[stack.pop()]:
            if crossing not in seen:
                seen.add(crossing)
                stack.append(crossing)
    return sorted(seen)
