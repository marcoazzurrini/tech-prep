# Largest Rectangle in Histogram (hard)

The array `heights` describes a histogram. Bar `i` has height `heights[i]` and width `1`. The bars stand side by side with no gaps. Return the area of the largest rectangle that fits inside the bars.

Example 1: heights = [2, 1, 5, 6, 2, 3]  ->  10
  The bars of height 5 and 6 hold a rectangle of height 5 and width 2.
Example 2: heights = [2, 4]  ->  4

Constraints: 1 <= len(heights) <= 10^5, 0 <= heights[i] <= 10^4.
Follow-up: can you do it in O(n) time?
