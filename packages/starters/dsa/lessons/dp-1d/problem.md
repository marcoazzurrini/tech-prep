# Cheapest Frog Path (easy)

A frog stands on stone 0 and wants to reach the last stone. `heights[i]` is the height of stone `i`. The frog jumps forward one stone or two stones at a time. A jump costs the difference in height between the two stones, as a positive number.

Return the lowest total cost to reach the last stone.

Example 1: heights = [10, 30, 40, 20] -> 30 Jump 0 to 1 for 20, then 1 to 3 for 10. Example 2: heights = [10, 10] -> 0 Example 3: heights = [5] -> 0

Constraints: 1 <= len(heights) <= 1000, 0 <= heights[i] <= 10^4.
