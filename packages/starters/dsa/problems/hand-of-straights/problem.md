# Hand of Straights (medium)

`hand` is a list of card values. Split all the cards into groups of exactly `groupSize` cards. The values in each group must be consecutive: each value is one more than the value before it. Return true if you can do this with every card in exactly one group, false otherwise.

Example 1: hand = [1, 2, 3, 6, 2, 3, 4, 7, 8], groupSize = 3  ->  true  (groups [1, 2, 3], [2, 3, 4], [6, 7, 8])
Example 2: hand = [1, 2, 3, 4, 5], groupSize = 4  ->  false  (5 cards do not split into groups of 4)

Constraints: 1 <= len(hand) <= 10^4, 0 <= hand[i] <= 10^9, 1 <= groupSize <= len(hand).
