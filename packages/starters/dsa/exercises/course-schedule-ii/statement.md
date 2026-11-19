# Course Schedule II (medium)

There are `numCourses` courses, labelled `0` to `numCourses - 1`. Each pair `[a, b]` in `prerequisites` means you must take course `b` before course `a`.

Return an order in which you can take all the courses. If several orders are valid, return any one of them: every valid order is accepted. If no order is valid, return an empty list.

Example 1: numCourses = 2, prerequisites = [[1, 0]]  ->  [0, 1]
Example 2: numCourses = 4, prerequisites = [[1, 0], [2, 0], [3, 1], [3, 2]]  ->  [0, 1, 2, 3]  ([0, 2, 1, 3] is also valid)
Example 3: numCourses = 2, prerequisites = [[1, 0], [0, 1]]  ->  []  (each course needs the other first)

Constraints: 1 <= numCourses <= 2000, 0 <= prerequisites.length <= 5000, all pairs are distinct.
