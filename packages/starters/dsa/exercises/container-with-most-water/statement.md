# Container With Most Water (medium)

You get an array `height` where `height[i]` is a vertical line at x = i. Pick two lines that, together with the x-axis, hold the most water. The water level is limited by the shorter line. Return the maximum amount of water.

Example 1: height = [1, 8, 6, 2, 5, 4, 8, 3, 7]  ->  49   (lines at i = 1 and i = 8: 7 * min(8, 7))
Example 2: height = [1, 1]  ->  1

Constraints: 2 <= len(height) <= 10^5, 0 <= height[i] <= 10^4.
