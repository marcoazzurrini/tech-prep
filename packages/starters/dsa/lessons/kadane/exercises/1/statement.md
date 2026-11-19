# Worst Stretch (easy)

Each number in `changes` says how much a shop's balance changed on one day. A stretch is one or more days in a row. Return the lowest total change of any stretch.

Example 1: changes = [3, -4, 2, -5, 1] -> -7 (the stretch [-4, 2, -5]) Example 2: changes = [1, 2, 3] -> 1 (the best you can do is the single day 1) Example 3: changes = [5] -> 5

Constraints: 1 <= len(changes) <= 1000, -1000 <= changes[i] <= 1000.
