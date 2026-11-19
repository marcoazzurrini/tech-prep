# Min Cost Climbing Stairs (easy)

`cost[i]` is the price you pay to step on stair `i`. After you pay, you climb one or two stairs. You may start on stair 0 or on stair 1. The top is one step past the last stair.

Return the lowest total price to reach the top.

Example 1: cost = [10, 15, 20]  ->  15
  Start on stair 1, pay 15, and climb two stairs to the top.
Example 2: cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]  ->  6

Constraints: 2 <= len(cost) <= 1000, 0 <= cost[i] <= 999.
