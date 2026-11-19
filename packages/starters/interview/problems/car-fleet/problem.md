# Car Fleet (medium)

Cars drive along one lane toward a point `target` miles away. Car `i` starts at mile `position[i]` and drives at `speed[i]` miles per hour.

A car cannot pass the car in front of it. When it catches up, it slows down and drives beside that car at the slower speed. Cars that drive together form a **fleet**. One car alone is also a fleet. Cars that meet exactly at `target` count as one fleet.

Return the number of fleets that arrive at `target`.

Example 1: target = 12, position = [10, 8, 0, 5, 3], speed = [2, 4, 1, 1, 3]  ->  3
  The cars at 10 and 8 meet at 12. The cars at 5 and 3 meet at 6. The car at 0 stays alone.
Example 2: target = 10, position = [3], speed = [3]  ->  1
Example 3: target = 100, position = [0, 2, 4], speed = [4, 2, 1]  ->  1

Constraints: 1 <= len(position) <= 10^5, 0 <= position[i] < target <= 10^6, 1 <= speed[i] <= 10^6. All start positions are different.
