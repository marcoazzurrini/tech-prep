# Same Tree (easy)

Given the roots `p` and `q` of two binary trees, return `true` if they are identical: the same shape, with the same value in every matching position.

Example 1: p = [1, 2, 3], q = [1, 2, 3]  ->  true
Example 2: p = [1, 2], q = [1, null, 2]  ->  false  (2 is a left child in one, a right child in the other)
Example 3: p = [1, 2, 1], q = [1, 1, 2]  ->  false

Trees are shown in level order, with `null` for a missing child.
Constraints: 0 <= number of nodes in each tree <= 100, -10^4 <= Node.val <= 10^4.
