# Serialize and Deserialize Binary Tree (hard)

Design a class `Codec` with two methods:
- `serialize(root)`: turns a binary tree into a string.
- `deserialize(data)`: turns that string back into the same tree.

Any string format works, as long as `deserialize(serialize(root))` rebuilds exactly the same tree (same values, same shape).

Example: root = [1, 2, 3, null, null, 4, 5]  ->  rebuilt tree [1, 2, 3, null, null, 4, 5]

Trees are shown in level order, with `null` for a missing child.
Constraints: 0 <= number of nodes <= 10^4, -1000 <= Node.val <= 1000.
