# Find the Lost Ticket (easy)

A shop gave out tickets with the numbers in `issued`. Two tickets may have the same number. All tickets came back except one. `returned` holds the numbers that came back, in any order.

Return the number of the lost ticket.

Example 1: issued = [1, 2, 3], returned = [3, 1] -> 2 Example 2: issued = [5, 5, 9], returned = [5, 9] -> 5 Example 3: issued = [7], returned = [] -> 7

Constraints: 1 <= len(issued) <= 1000, len(returned) = len(issued) - 1, -10^6 <= issued[i] <= 10^6. Follow-up: can you do it with O(1) extra space?
