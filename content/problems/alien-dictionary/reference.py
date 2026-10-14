from collections import deque


def alien_order(words: list[str]) -> str:
    graph = {ch: set() for word in words for ch in word}
    indegree = {ch: 0 for ch in graph}

    # Each adjacent pair gives at most one rule: the first letters that differ.
    for first, second in zip(words, words[1:]):
        for a, b in zip(first, second):
            if a != b:
                if b not in graph[a]:
                    graph[a].add(b)
                    indegree[b] += 1
                break
        else:
            if len(first) > len(second):
                return ""  # a longer word before its own prefix is impossible

    queue = deque(sorted(ch for ch in graph if indegree[ch] == 0))
    order = []
    while queue:
        ch = queue.popleft()
        order.append(ch)
        for nxt in sorted(graph[ch]):
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                queue.append(nxt)
    return "".join(order) if len(order) == len(graph) else ""  # leftovers mean a cycle
