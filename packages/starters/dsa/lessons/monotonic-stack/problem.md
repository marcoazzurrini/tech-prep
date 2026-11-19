# Nearest Taller on the Left (easy)

People stand in a line. `heights[i]` is the height of person `i`. For each person, find the nearest person to their left who is taller. Equal height does not count as taller.

Return an array `answer` where `answer[i]` is the index of that taller person. If nobody to the left is taller, `answer[i]` is `-1`. Your solution must run in O(n) time.

Example 1: heights = [5, 3, 4, 6] -> [-1, 0, 0, -1] Person 2 has height 4. Person 1 is shorter. Person 0 is taller, so the answer is 0. Example 2: heights = [3, 2, 1] -> [-1, 0, 1] Example 3: heights = [4, 4, 4] -> [-1, -1, -1]

Constraints: 0 <= len(heights) <= 1000, 1 <= heights[i] <= 300.
