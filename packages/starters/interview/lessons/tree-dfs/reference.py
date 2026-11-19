from ds import TreeNode


def count_leaves(root: TreeNode | None) -> int:
    # Base cases: an empty tree has no leaves, and a leaf counts as one.
    if not root:
        return 0
    if not root.left and not root.right:
        return 1
    # The node's answer is the sum of its children's answers.
    return count_leaves(root.left) + count_leaves(root.right)
