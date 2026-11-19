# Merge Triplets to Form Target Triplet (medium)

A triplet is a list of three integers. You are given a list `triplets` and one triplet `target`.

One step picks two triplets and merges the first into the second. The second triplet takes the larger value at each of the three positions. You may do any number of steps, also zero. Return true if `target` can become one of the triplets, false otherwise.

Example 1: triplets = [[2, 5, 3], [1, 8, 4], [1, 7, 5]], target = [2, 7, 5]  ->  true  (merge the first triplet into the last)
Example 2: triplets = [[3, 4, 5], [4, 5, 6]], target = [3, 2, 5]  ->  false  (the middle value is never 2)
Example 3: triplets = [[2, 5, 3], [2, 3, 4], [1, 2, 5], [5, 2, 3]], target = [5, 5, 5]  ->  true

Constraints: 1 <= len(triplets) <= 10^5, every value is between 1 and 1000.
