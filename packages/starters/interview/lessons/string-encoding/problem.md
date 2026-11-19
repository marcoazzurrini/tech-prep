# Unpack Number Groups (easy)

Several groups of numbers were packed into one flat array `data`. Each group is written as its length, followed by its numbers. So `[7, 8]` is written as `2, 7, 8`. An empty group is written as `0`.

Return the list of groups, in order.

Example 1: data = [2, 7, 8, 1, 5, 3, 1, 1, 1]  ->  [[7, 8], [5], [1, 1, 1]]
Example 2: data = [0, 1, 4]  ->  [[], [4]]
Example 3: data = []  ->  []

Constraints: 0 <= len(data) <= 10^4, 0 <= data[i] <= 1000. `data` is always a valid packing.
