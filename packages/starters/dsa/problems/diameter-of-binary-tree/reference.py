from ds import TreeNode


def diameter_of_binary_tree(root: TreeNode | None) -> int:
    best = 0

    def height(node: TreeNode | None) -> int:
        nonlocal best
        if not node:
            return 0
        left, right = height(node.left), height(node.right)
        # Two-sided: the longest path that bends at this node.
        best = max(best, left + right)
        # One-sided: the parent can extend only the taller side.
        return 1 + max(left, right)

    height(root)
    return best
