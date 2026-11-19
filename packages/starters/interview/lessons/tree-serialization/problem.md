# Depth of an Encoded Tree (easy)

A binary tree was written in preorder: node, then left subtree, then right subtree. Every missing child was written as `"#"`. You get the result as the list `tokens`. Return the depth of the tree: the number of nodes on the longest path from the root down to a leaf.

Do not build the tree. Read the tokens in order with one position counter, the same way you would rebuild it.

Example 1: tokens = ["1", "2", "#", "#", "#"] -> 2 (2 is the left child of 1) Example 2: tokens = ["1", "#", "#"] -> 1 Example 3: tokens = ["#"] -> 0 (the empty tree)

Constraints: 1 <= len(tokens) <= 2001, `tokens` is a valid encoding, values are integers written as text.
