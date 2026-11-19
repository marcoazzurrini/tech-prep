# Median of Two Sorted Arrays (hard)

The arrays `nums1` and `nums2` are each sorted from smallest to largest. Return the median of all their values together.

With an odd number of values, the median is the middle value. With an even number, it is the average of the two middle values, so it may end in .5.

Your solution must run in O(log(m + n)) time, where `m` and `n` are the lengths of the two arrays.

Example 1: nums1 = [1, 3], nums2 = [2]  ->  2
  Together the values are [1, 2, 3]. The middle value is 2.
Example 2: nums1 = [1, 2], nums2 = [3, 4]  ->  2.5
  Together the values are [1, 2, 3, 4]. The average of 2 and 3 is 2.5.

Constraints: 0 <= m, n <= 1000, 1 <= m + n, -10^6 <= nums1[i], nums2[i] <= 10^6.
