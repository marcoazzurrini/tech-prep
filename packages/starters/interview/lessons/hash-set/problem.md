# Count Absent Students (easy)

`roster` lists the names of all students in a class. `present` lists the names of the people who came today. Return how many students on the roster did not come.

Names on the roster are all different. `present` may hold names that are not on the roster. Ignore those.

Example 1: roster = ["ana", "li", "sam"], present = ["li"] -> 2 Example 2: roster = ["ana"], present = ["ana", "bo"] -> 0 Example 3: roster = [], present = [] -> 0

Constraints: 0 <= len(roster), len(present) <= 10^4. Follow-up: can you do it in O(len(roster) + len(present)) time?
