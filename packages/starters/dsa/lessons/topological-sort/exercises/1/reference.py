def count_doable_tasks(n: int, deps: list[list[int]]) -> int:
    # waiting[t] counts the tasks that must still be done before task t.
    after: list[list[int]] = [[] for _ in range(n)]
    waiting = [0] * n
    for a, b in deps:
        after[a].append(b)
        waiting[b] += 1

    # Take every task that waits for nothing. Taking a task frees the tasks after it.
    done = [t for t in range(n) if waiting[t] == 0]
    for task in done:  # the loop also reads tasks appended below
        for nxt in after[task]:
            waiting[nxt] -= 1
            if waiting[nxt] == 0:
                done.append(nxt)
    return len(done)
