def find_order(num_courses: int, prerequisites: list[list[int]]) -> list[int]:
    # Kahn's algorithm: count the unmet prerequisites of every course.
    graph: list[list[int]] = [[] for _ in range(num_courses)]
    indegree = [0] * num_courses
    for course, pre in prerequisites:
        graph[pre].append(course)
        indegree[course] += 1

    # A course with a count of zero can be taken now. The order list is also the queue.
    order = [c for c in range(num_courses) if indegree[c] == 0]
    for pre in order:
        for course in graph[pre]:
            indegree[course] -= 1
            if indegree[course] == 0:
                order.append(course)
    # Courses that were never taken are on a cycle.
    return order if len(order) == num_courses else []
