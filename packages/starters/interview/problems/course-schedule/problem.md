# Course Schedule (medium)

There are `num_courses` courses labelled `0` to `num_courses - 1`. Each pair `[a, b]` in `prerequisites` means course `b` must be taken before course `a`. Return `true` if it is possible to take every course.

Example 1: num_courses = 2, prerequisites = [[1, 0]]  ->  true  (take 0, then 1)
Example 2: num_courses = 2, prerequisites = [[1, 0], [0, 1]]  ->  false  (each needs the other first)

Constraints: 1 <= num_courses <= 2000, 0 <= len(prerequisites) <= 5000, all pairs are distinct.
