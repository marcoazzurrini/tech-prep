# Share of the Smallest (easy)

The arrays `a` and `b` are each sorted from smallest to largest. All values are different, also between the two arrays. Look at the `k` smallest values of both arrays together. Return how many of them come from `a`. Your solution must run in O(log n) time, so do not merge the arrays.

Example 1: a = [1, 4, 7], b = [2, 3, 9], k = 3 -> 1 The 3 smallest values are 1, 2 and 3. Only 1 comes from `a`. Example 2: a = [1, 4, 7], b = [2, 3, 9], k = 4 -> 2 The 4 smallest values are 1, 2, 3 and 4. Both 1 and 4 come from `a`. Example 3: a = [10, 20], b = [1, 2, 3], k = 3 -> 0

Constraints: 0 <= len(a), len(b) <= 1000, 0 <= k <= len(a) + len(b), -10^6 <= a[i], b[i] <= 10^6.
