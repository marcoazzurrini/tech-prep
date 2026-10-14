# Construct Binary Tree from Preorder and Inorder Traversal (medium)

You get two integer arrays describing the same binary tree: `preorder` (node, then left subtree, then right subtree) and `inorder` (left subtree, then node, then right subtree). All values are distinct. Rebuild the tree and return its root.

Example 1: preorder = [3, 9, 20, 15, 7], inorder = [9, 3, 15, 20, 7]  ->  [3, 9, 20, null, null, 15, 7]
Example 2: preorder = [-1], inorder = [-1]  ->  [-1]
Example 3: preorder = [1, 2], inorder = [1, 2]  ->  [1, null, 2]  (2 comes after 1 in inorder, so it is the right child)

Trees are shown in level order, with `null` for a missing child.
Constraints: 1 <= len(preorder) == len(inorder) <= 3000, -3000 <= value <= 3000, values are unique.
