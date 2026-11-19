# Highest Climb (easy)

A wall has ladders on it. Each entry of `ladders` is `[bottom, top]`: the heights where one ladder starts and ends. The ladders are sorted by `bottom`.

You start at height 0. You can get on a ladder when its `bottom` is not above the highest height you have reached. A ladder takes you up to its `top`. Return the highest height you can reach.

Example 1: ladders = [[0, 3], [2, 5], [6, 9]]  ->  5  (the last ladder starts at 6, above your reach of 5)
Example 2: ladders = [[1, 4]]  ->  0  (the only ladder starts above the ground)
Example 3: ladders = []  ->  0

Constraints: 0 <= len(ladders) <= 1000, 0 <= bottom <= top <= 10^6.
