from collections import deque


def can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool:
    # Kahn's algorithm: repeatedly take a course with no unmet prerequisites.
    graph = [[] for _ in range(num_courses)]
    indegree = [0] * num_courses
    for course, pre in prerequisites:
        graph[pre].append(course)
        indegree[course] += 1

    queue = deque(i for i in range(num_courses) if indegree[i] == 0)
    taken = 0
    while queue:
        pre = queue.popleft()
        taken += 1
        for course in graph[pre]:
            indegree[course] -= 1
            if indegree[course] == 0:
                queue.append(course)
    return taken == num_courses
