# Merge Neighbouring Piles (easy)

`piles` is a row of piles of stones. In one step you merge two piles that are next to each other into one pile. The step costs the size of the new pile. Repeat until one pile is left.

Return the smallest total cost. Return `0` if there is only one pile.

Example 1: piles = [3, 5] -> 8 Example 2: piles = [1, 2, 3] -> 9 (merge 1 and 2 for 3, then 3 and 3 for 6) Example 3: piles = [6, 4, 4, 6] -> 40 (merge 6 and 4, merge 4 and 6, then 10 and 10)

Constraints: 1 <= len(piles) <= 100, 1 <= piles[i] <= 1000.
