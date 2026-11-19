# Tree Height from Traversals (easy)

You get the `preorder` and `inorder` traversals of the same binary tree. All values are different. Return the height of the tree: the number of nodes on the longest path from the root down to a leaf. An empty tree has height 0.

You do not need to build any nodes. Split the two arrays into the left and right subtree, as in the lesson, and recurse.

Example 1: preorder = [3, 9, 20, 15, 7], inorder = [9, 3, 15, 20, 7] -> 3 The root is 3. Left of it in `inorder` is [9]. Right of it is [15, 20, 7]. Example 2: preorder = [1, 2, 3], inorder = [2, 1, 3] -> 2 Example 3: preorder = [], inorder = [] -> 0

Constraints: 0 <= len(preorder) <= 100, len(inorder) = len(preorder), values are unique.
