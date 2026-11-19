def can_jump_forever(n: int, jumps: list[list[int]], start: int) -> bool:
    graph: list[list[int]] = [[] for _ in range(n)]
    for a, b in jumps:
        graph[a].append(b)

    ON_PATH, DONE = 1, 2
    state = [0] * n

    def reaches_cycle(square: int) -> bool:
        # A square that is still on the current path closes a cycle.
        if state[square] == ON_PATH:
            return True
        # A finished square was fully checked: no cycle behind it.
        if state[square] == DONE:
            return False
        state[square] = ON_PATH
        if any(reaches_cycle(nxt) for nxt in graph[square]):
            return True
        state[square] = DONE
        return False

    return reaches_cycle(start)
