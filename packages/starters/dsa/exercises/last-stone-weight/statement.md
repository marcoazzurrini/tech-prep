# Last Stone Weight (easy)

You have a pile of stones. `stones[i]` is the weight of stone `i`. Each turn, take the two heaviest stones and smash them together:
- If they weigh the same, both are destroyed.
- If not, the lighter one is destroyed, and the heavier one loses the weight of the lighter one.

Repeat until at most one stone is left. Return the weight of that stone, or `0` if no stone is left.

Example 1: stones = [2, 7, 4, 1, 8, 1]  ->  1
  8 and 7 leave 1. 4 and 2 leave 2. 2 and 1 leave 1. 1 and 1 leave nothing. One stone of weight 1 is left.
Example 2: stones = [1]  ->  1
Example 3: stones = [2, 2]  ->  0

Constraints: 1 <= len(stones) <= 30, 1 <= stones[i] <= 1000.
