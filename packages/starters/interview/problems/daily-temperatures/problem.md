# Daily Temperatures (medium)

The array `temperatures` holds one temperature per day. For each day, find how many days you must wait for a warmer day. Return an array `answer` where `answer[i]` is that number of days for day `i`. If no later day is warmer, `answer[i]` is `0`.

Example 1: temperatures = [73, 74, 75, 71, 69, 72, 76, 73]  ->  [1, 1, 4, 2, 1, 1, 0, 0]
Example 2: temperatures = [30, 40, 50, 60]  ->  [1, 1, 1, 0]
Example 3: temperatures = [30, 60, 90]  ->  [1, 1, 0]

Constraints: 1 <= len(temperatures) <= 10^5, 30 <= temperatures[i] <= 100.
Follow-up: can you do it in O(n) time?
