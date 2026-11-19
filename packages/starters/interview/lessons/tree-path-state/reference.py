from ds import TreeNode


def count_ancestor_sum_nodes(root: TreeNode | None) -> int:
    def count(node: TreeNode | None, above: int) -> int:
        # `above` is the sum of the values on the path above this node.
        if not node:
            return 0
        here = 1 if node.val == above else 0
        # Add this node's value before passing the sum down.
        below = above + node.val
        return here + count(node.left, below) + count(node.right, below)

    return count(root, 0)
